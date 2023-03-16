import { Joi } from 'celebrate';

/**Validation Change Email*/
export const updateValidationBodyChangeEmail = {
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      //tlds: { allow: ['com', 'net', 'tn', 'fr'] },
    })
    .required(),
};
/**Validation Update Password*/
export const updateValidationBodyPassword = {
  password: Joi.string()
    .min(8)
    .max(20)
    .regex(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})'))
    .required(),
  old_password: Joi.string()
    .min(8)
    .max(20)
    .regex(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})'))
    .required(),
};

/**Validation Update Reset Password Body*/
export const validationBodyResetPassword = {
  code: Joi.string().required(),
  password: Joi.string()
    .min(8)
    .max(20)
    .regex(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})'))
    .required(),
};

/**Validation Create User*/
export const createValidationBodyUser = {
  firstName: Joi.string()
    .max(100)
    .required(),
  lastName: Joi.string()
    .max(100)
    .required(),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      //tlds: { allow: ['com', 'net', 'tn', 'fr'] },
    })
    .required(),
  password: Joi.string()
    .min(8)
    .max(20)
    .regex(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})'))
    .required(),
};
/**Validation Update User*/
export const updateValidationBodyUser = {
  firstName: Joi.string()
    .max(100)
    .allow(),
  lastName: Joi.string()
    .max(100)
    .allow(),
};

/**Validation Create Reservation Body*/
export const createValidationBodyReservation = {
  tickets: Joi.array().required(),
  routeId: Joi.string().required(),
};
/**Validation Update Reservation Body*/
export const updateValidationBodyReservation = {
  tickets: Joi.array().allow(''),
  routeId: Joi.string().allow(''),
  status: Joi.boolean().allow(''),
  userReservationId: Joi.string().required(),
};

/**Validation Create Route Body*/
export const createValidationBodyRoute = {
  routeStart: Joi.string()
    .max(100)
    .required(),
  routeEnd: Joi.string()
    .max(100)
    .required(),
  seatList: Joi.number()
    .integer()
    .required(),
};
/**Validation Update Route Body*/
export const updateValidationBodyRoute = {
  routeId: Joi.string().required(),
  routeStart: Joi.string()
    .max(100)
    .allow(''),
  routeEnd: Joi.string()
    .max(100)
    .allow(''),
  seatList: Joi.number()
    .integer()
    .allow(''),
  status: Joi.boolean().allow(),
};
/**Validation Create Ticket Body*/
export const createValidationBodyTicket = {
  number: Joi.string()
    .max(100)
    .required(),
  routeId: Joi.string().required(),
  date: Joi.date().required(),
  price: Joi.number().required(),
};
/**Validation Update Ticket Body*/
export const updateValidationBodyTicket = {
  number: Joi.number()
    .integer()
    .allow(null),
  routeId: Joi.string().allow(),
  date: Joi.date().allow(),
  price: Joi.number().allow(),
  ticketId: Joi.string().required(),
  status: Joi.boolean().allow(),
};
