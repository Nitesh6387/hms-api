import { Contact } from "../../Entities/ContactTbl";
import { createResponse } from "../../Helpers/createResponse";
import { asyncHandler } from "../../middleware/errorHandler";
import logger from "../../config/logger";

export const createContactController = asyncHandler(async (req: any, res: any) => {
  try {
    const { name, email, subject, message, phone } = req.body;

    if (!name || !email || !subject || !message) {
      return createResponse(res, 400, "Name, email, subject, and message are required", [], false, true);
    }

    const contact = new Contact();
    contact.name = name;
    contact.email = email;
    contact.subject = subject;
    contact.message = message;
    contact.phone = phone;
    contact.isRead = false;

    await contact.save();

    logger.info(`Contact form submitted: ${email}`);
    return createResponse(res, 201, "Contact form submitted successfully", contact, true, false);
  } catch (error: any) {
    logger.error('Create contact error:', error);
    return createResponse(res, 500, "Internal server error", [], false, true);
  }
});

export const getAllContactsController = asyncHandler(async (req: any, res: any) => {
  try {
    const { page = 1, limit = 10, isRead } = req.query;
    const skip = (page - 1) * limit;

    const queryBuilder = Contact.createQueryBuilder('contact');

    if (isRead !== undefined) {
      queryBuilder.where('contact.isRead = :isRead', { isRead: isRead === 'true' });
    }

    const [contacts, total] = await queryBuilder
      .orderBy('contact.createdAt', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return createResponse(res, 200, "Contacts fetched successfully", {
      contacts,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / limit)
    }, true, false);
  } catch (error: any) {
    logger.error('Get contacts error:', error);
    return createResponse(res, 500, "Internal server error", [], false, true);
  }
});

export const getContactByIdController = asyncHandler(async (req: any, res: any) => {
  try {
    const { id } = req.params;

    const contact = await Contact.findOne({ where: { id } });

    if (!contact) {
      return createResponse(res, 404, "Contact not found", [], false, true);
    }

    return createResponse(res, 200, "Contact fetched", contact, true, false);
  } catch (error: any) {
    logger.error('Get contact by id error:', error);
    return createResponse(res, 500, "Internal server error", [], false, true);
  }
});

export const updateContactStatusController = asyncHandler(async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { isRead } = req.body;

    const contact = await Contact.findOne({ where: { id } });

    if (!contact) {
      return createResponse(res, 404, "Contact not found", [], false, true);
    }

    contact.isRead = isRead;
    await contact.save();

    logger.info(`Contact status updated: ${id}`);
    return createResponse(res, 200, "Contact status updated", contact, true, false);
  } catch (error: any) {
    logger.error('Update contact status error:', error);
    return createResponse(res, 500, "Internal server error", [], false, true);
  }
});

export const deleteContactController = asyncHandler(async (req: any, res: any) => {
  try {
    const { id } = req.params;

    const contact = await Contact.findOne({ where: { id } });

    if (!contact) {
      return createResponse(res, 404, "Contact not found", [], false, true);
    }

    await Contact.remove(contact);

    logger.info(`Contact deleted: ${id}`);
    return createResponse(res, 200, "Contact deleted successfully", contact, true, false);
  } catch (error: any) {
    logger.error('Delete contact error:', error);
    return createResponse(res, 500, "Internal server error", [], false, true);
  }
});