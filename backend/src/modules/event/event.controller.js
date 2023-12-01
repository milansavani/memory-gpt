import httpStatus from 'http-status';
import stringConst from '../../utils/constant.js';
import eventData from '../../data/events.js';

/**
 * Returns list of Event
 * @returns {token, Event}
 */
const fetchEvents = async (req, res, next) => {
  try {
    return res.status(httpStatus.OK).json({
      statusCode: 200,
      message: stringConst.apiSuccessMessage.fetchEvents,
      data: eventData,
    });
  } catch (error) {
    return next(error);
  }
};

export default { fetchEvents };
