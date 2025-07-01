/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpError } from '../../errors/HttpError';
import { User } from '../User/user.model';
import { TTransaction } from './transaction.interface';
import { generateTransactionId } from './transaction.utils';
import { Transaction } from './transaction.model';
import QueryBuilder from '../../builder/QueryBuilder';
import { Listing } from '../Listings/listing.model';

// create transaction without payment gateway
const createTransactionIntoDB = async (
  payload: TTransaction,
  identifier: string,
) => {
  // check if buyer exists
  const buyer = await User.isUserExists(identifier);
  if (!buyer) {
    throw new HttpError(404, 'Buyer not found with this ID');
  }
  payload.buyerID = buyer._id;

  // check if item/listing exists
  const listing = await Listing.findOne({ _id: payload.itemID });
  if (!listing) {
    throw new HttpError(404, 'Item not found with this ID');
  }

  // check if seller exists
  const seller = await User.findOne({ _id: listing.userID });
  if (!seller) {
    throw new HttpError(404, 'Seller not found with this ID');
  }
  payload.sellerID = seller._id;

  // generate transaction ID
  const transactionId = generateTransactionId();
  payload.transactionId = transactionId;

  try {
    // Create transaction in DB
    const createdOrder = await Transaction.create(payload);
    return {
      createdOrder,
    };
  } catch (err: any) {
    throw new HttpError(500, 'Failed to create transaction.');
  }
};

// update transaction status by id
const updateTransactionStatusByIdIntoDB = async (
  id: string,
  status: string,
  identifier: string,
) => {
  const user = await User.isUserExists(identifier);
  if (!user) {
    throw new HttpError(404, 'User not found');
  }

  const validStatuses = ['pending', 'sold'];

  if (!validStatuses.includes(status)) {
    throw new HttpError(400, `Invalid status: ${status}`);
  }

  const updatedStatus = await Transaction.findOneAndUpdate(
    { _id: id },
    { status: status },
    { new: true, runValidators: true },
  );
  if (!updatedStatus) {
    throw new HttpError(404, 'No transaction found with ID');
  }
  return updatedStatus;
};

// Get purchases history by particular user
const getPurchasesHistoryByParticularUserFromDB = async (
  identifier: string,
  query: Record<string, unknown>,
) => {
  const user = await User.isUserExists(identifier);
  if (!user) {
    throw new HttpError(404, 'User not found');
  }
  const activeListingIds = await Listing.find({ isDeleted: false }).distinct(
    '_id',
  );
  const purchasesHistoryQuery = new QueryBuilder(
    Transaction.find({ buyerID: user._id, itemID: { $in: activeListingIds } })
      .populate('buyerID', '_id name identifier role')
      .populate('sellerID', '_id name identifier role')
      .populate('itemID'),
    query,
  )
    .sortBy()
    .paginate();
  const meta = await purchasesHistoryQuery.countTotal();
  const result = await purchasesHistoryQuery.modelQuery;
  if (result.length === 0) {
    throw new HttpError(404, 'No purchases history found for this user');
  }
  return {
    meta,
    result,
  };
};

// Get sales history by particular user
const getSalesHistoryByParticularUser = async (
  identifier: string,
  query: Record<string, unknown>,
) => {
  const user = await User.isUserExists(identifier);
  if (!user) {
    throw new HttpError(404, 'User not found');
  }
  const activeListingIds = await Listing.find({ isDeleted: false }).distinct(
    '_id',
  );
  const salesHistoryQuery = new QueryBuilder(
    Transaction.find({ sellerID: user._id, itemID: { $in: activeListingIds } })
      .populate('buyerID', '_id name identifier role')
      .populate('sellerID', '_id name identifier role')
      .populate('itemID'),
    query,
  )
    .sortBy()
    .paginate();
  const meta = await salesHistoryQuery.countTotal();
  const result = await salesHistoryQuery.modelQuery;
  if (result.length === 0) {
    throw new HttpError(404, 'No sales history found for this user');
  }
  return {
    meta,
    result,
  };
};

export const TransactionServices = {
  createTransactionIntoDB,
  updateTransactionStatusByIdIntoDB,
  getPurchasesHistoryByParticularUserFromDB,
  getSalesHistoryByParticularUser,
};
