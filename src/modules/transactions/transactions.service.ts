import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import 'dotenv/config';
import { promises as fs } from 'fs';
import { FileUpload } from 'graphql-upload';
import { join } from 'path';
import { ValidaionException } from 'src/shared/exceptions';
import {
  ObjectWithDatesGenerator,
  uploadToGoogleCloud,
} from 'src/shared/utils';
import { EntityValidator } from 'src/shared/validators';
import { DataSource } from 'typeorm';
import { v4 as uuid } from 'uuid';
import {
  Notification,
  NotificationType,
  Transaction,
  User,
} from '../../entities';
import { FindAllTransactionsInput } from './dto';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    @Inject(ObjectWithDatesGenerator<Transaction>)
    private readonly objectWithDatesGenerator: ObjectWithDatesGenerator<Transaction>,
    @Inject(EntityValidator)
    private readonly entityValidator: EntityValidator,
  ) {}

  private validateUserParticipationInTransaction(
    currentUser: User,
    transaction: Transaction,
  ) {
    const isCurrentUserInvolvedInTransaction =
      transaction.receiver.id === currentUser.id ||
      transaction.payer.id === currentUser.id;

    if (!isCurrentUserInvolvedInTransaction)
      throw new ValidaionException('User is not involved in the transaction');
  }

  async findAll(currentUser: User, body: FindAllTransactionsInput) {
    const { groupId, filterByUser } = body;
    const em = this.dataSource
      .getRepository(Transaction)
      .createQueryBuilder('transaction');

    const [group] = await this.entityValidator.validateGroups(
      [groupId],
      currentUser.id,
    );

    const transactions = await em
      .leftJoinAndSelect('transaction.receiver', 'receiver')
      .leftJoinAndSelect('transaction.payer', 'payer')
      .where('transaction.groupId = :groupId', { groupId: group.id })
      .if(filterByUser, (qb) =>
        qb.andWhere(
          '(payer.id = :currentUserId OR receiver.id = :currentUserId)',
          { currentUserId: currentUser.id },
        ),
      )
      .getMany();
    return transactions;
  }

  async findOne(currentUser: User, transactionId: number) {
    const [transaction] = await this.entityValidator.validateTransactions([
      transactionId,
    ]);

    return transaction;
  }

  async completeTransaction(
    currentUser: User,
    transactionId: number,
    fileURL?: string | null,
  ) {
    const [transaction] = await this.entityValidator.validateTransactions([
      transactionId,
    ]);

    this.validateUserParticipationInTransaction(currentUser, transaction);

    if (fileURL) {
      transaction.confirmationFileURL = fileURL;
    }

    transaction.updatedAt = new Date();
    transaction.isCompleted = true;

    await this.dataSource.manager.transaction(
      async (transctionEntityManager) => {
        await transctionEntityManager.save(transaction);
      },
    );

    return transaction;
  }

  async uploadConmfirmationFile(file: FileUpload) {
    const { createReadStream, filename } = await file;

    const uuidHash = await uuid();
    const newFileName = `${uuidHash}-${filename}`;
    try {
      uploadToGoogleCloud(createReadStream, newFileName);
    } catch (err) {
      throw new HttpException(
        'Error with google cloud storage',
        HttpStatus.BAD_REQUEST,
      );
    }

    return `https://storage.googleapis.com/${process.env.GCP_BUCKET_ID}/${newFileName}`;
  }

  async generateCompleteTransactionNotification(transaction: Transaction) {
    const em = this.dataSource.getRepository(Notification);

    const newNotification: Partial<Notification> = {
      createdAt: new Date(),
      readBy: [],
      receivers: [transaction.receiver],
      createdBy: transaction.payer,
      group: transaction.group,
      type: NotificationType.TRANSACTION_RECEIVED,
    };

    const savedNotification = await em.save(newNotification);

    return savedNotification;
  }

  async getTransactionConfirmationFile(
    currentUser: User,
    transactionId: number,
  ) {
    const [transaction] = await this.entityValidator.validateTransactions([
      transactionId,
    ]);
    this.validateUserParticipationInTransaction(currentUser, transaction);

    if (Boolean(transaction.confirmationFileURL))
      throw new HttpException(
        'This application has no confirmation file',
        HttpStatus.BAD_REQUEST,
      );

    const base64File = await fs.readFile(
      join(process.cwd(), `./uploads/${transaction.confirmationFileURL}`),
      'base64',
    );

    return { base64File, filename: transaction.confirmationFileURL };
  }
}
