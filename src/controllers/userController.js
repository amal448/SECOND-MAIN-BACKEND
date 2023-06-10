const passwordHash = require("password-hash");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
require("dotenv").config();
const Appointment = require("../model/appointment");
const Users = require("../model/User");
const Doctors = require("../model/Doctor");
const Departments = require("../model/Department");
const moment = require("moment");

const Stripe = require("stripe");
require("dotenv").config();
const stripe = Stripe(process.env.STRIPE_KEY);

const {
  EMAILREGEX,
  checkPasswordHasSpecialCharacters,
  stringHasAnyNumber,
} = require("../utils/constants");
const { checkPassword } = require("../helpers/userHelper");

module.exports = {
  signup: (req, res) => {
    console.log("req.body");
    console.log(req.body);

    let errorMessages = {
      firstName: "",
      lastName: "",
      email: "",
      mobile: "",
      dateOfBirth: "",
      gender: "",
      password: "",
      confirmPassword: "",
    };
    let {
      firstName,
      lastName,
      email,
      mobile,
      dateOfBirth,
      gender,
      password,
      confirmPassword,
    } = req.body;

    if (
      firstName == "" ||
      lastName == "" ||
      email == "" ||
      mobile == "" ||
      dateOfBirth == "" ||
      gender == "" ||
      password == "" ||
      confirmPassword == ""
    ) {
      for (const key in req.body) {
        if (req.body[key] == "") {
          errorMessages = { ...errorMessages, [key]: "please provide" + key };
        } else {
          delete errorMessages[key];
        }
      }
      res.status(406).json({ ...errorMessages });
      return;
    }
    if (!checkPasswordHasSpecialCharacters(password)) {
      return res
        .status(406)
        .json({ password: "please include special characters" });
    }

    if (password != confirmPassword) {
      return res
        .status(406)
        .json({ confirmPassword: "password is not matching" });
    }

    if (!EMAILREGEX.test(email)) {
      return res.status(406).json({ email: "invalid email address" });
    }

    if (!stringHasAnyNumber(mobile)) {
      return res.status(406).json({ mobile: "invalid mobile number" });
    }

    console.log(req.body);

    try {
      Users.find({ email }).then((response) => {
        if (response.length > 0) {
          return res.status(409).json({ email: "email already exist" });
        } else {
          req.body.password = passwordHash.generate(password);

          delete req.body.confirmPassword;
          new Users({ ...req.body, block: false, active: false })
            .save()
            .then(async (response) => {
              delete req.body.password;

              // let testAccount = await nodemailer.createTestAccount();

              // create reusable transporter object using the default SMTP transport
              let transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 465,
                secure: true, // true for 465, false for other ports
                auth: {
                  user: process.env.EMAIL, // generated ethereal user
                  pass: process.env.EMAIL_TEST_APP_PSWD, // generated ethereal password
                },
              });

              // send mail with defined transport object
              let token = await String(
                jwt.sign({ ...req.body }, process.env.KEY)
              );
              let newtoken = token.replace(/\./g, "$");
              // newtoken = newtoken.replace(/\$/g, '.')
              let info = await transporter.sendMail({
                from: process.env.EMAIL, // sender address
                to: email, // list of receivers
                subject: "account activation link provided", // Subject line
                // text: "Hello world?", // plain text body
                html: `<b>click to the link for verification http://localhost:5173/activate-account/${newtoken}</b>`, // html body
              });

              res.status(200).json({ ok: true, message: "check your email" });
            });
        }
      });
    } catch (error) {
      console.log(error);
    }
  },
  login: (req, res) => {
    try {
      const { email, password } = req.body;
      if (email == "" || password == "") {
        return res
          .status(406)
          .json({ message: "please provide valid details" });
      }
      Users.find({ email }).then(async (user) => {
        console.log(email);
        if (user.length <= 0) {
          return res
            .status(406)
            .json({ type: "email", message: "user not found" });
        } else {
          console.log("user", user);
          user = user[0];
          if (checkPassword(password, user.password)) {
            const token = await jwt.sign({ ...user }, process.env.KEY);
            return res.status(200).json({ token, user });
          } else {
            return res
              .status(401)
              .json({ type: "password", message: "incorrect password" });
          }
        }
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: error.message });
    }
  },
  getAllDoctors: (req, res) => {
    return new Promise((resolve, reject) => {
      Doctors.find({}).then((response) => {
        console.log(response);
        for (let i = 0; i < response.length; i++) {
          console.log(response[i]);
          delete response[i].password;
        }
        res.status(200).json({ doctors: response });
      });
    });
  },
  getDepartments: async (req, res) => {
    console.log("@getDepartment");
    try {
      const department = await Departments.find({});
      console.log("department", department);
      if (department) {
        res.status(200).json({ response: department });
      } else {
        res.status(500).json({ message: "Some errors are occured here" });
      }
    } catch (error) {
      console.log("error", error);
      res.status(500).json({ message: "department not found" });
    }
  },
  activetAccount: (req, res) => {
    let { token } = req.params;
    token = token.replace(/\$/g, ".");
    console.log(token);
    const { email } = jwt.decode(token);
    Users.updateOne({ email }, { $set: { active: true } }).then((result) => {
      res.status(200).json({ ok: true, message: "useractivated" });
    });
    // Users.updateOne
  },

  departmentexpdoc: async (req, res) => {
    try {
      let doctors = await Doctors.find({ block: false });

      let mostExperiencedDoctors = [];

      doctors.forEach((doctor) => {
        const department = doctor.department;
        console.log("department", department);
        console.log(doctor);
        console.log("/////////////////////////");
        if (
          !mostExperiencedDoctors[department] ||
          parseInt(doctor.experience) >
            parseInt(mostExperiencedDoctors[department].experience)
        ) {
          mostExperiencedDoctors.push(doctor);
          console.log("mostExperiencedDoctors", mostExperiencedDoctors);
        }
      });
      // console.log(mostExperiencedDoctors);
      console.log("llllllllllllllllllllllllllllllllllllllllll");
      res.status(200).json({ response: mostExperiencedDoctors });
    } catch (error) {
      console.log(error);
      res.status(500).json("Some error is happened here");
    }
  },
  getdepartmentdoctors: async (req, res) => {
    console.log("@getdepartmentfoctor");
    console.log(req.params.department);
    try {
      const { department } = req.params;

      console.log("dep ", department);
      const departmentDoctors = await Doctors.find({ department });
      if (department) {
        console.log("departmentpopopop", departmentDoctors);
        res.status(200).json(departmentDoctors);
      } else {
        console.log("department not found");
      }
    } catch (error) {
      console.log("251 ", error);
      res.status(500).json({ error: "Error retrieving doctors" });
    }
  },

  checkAvailability: async (req, res) => {
    console.log("Hello from check");
    try {
      const { date, doctorId } = req.body;
      console.log(date);
      console.log(doctorId);

      let momentObj;

      if (date && doctorId) {
        momentObj = moment(date, "MM/DD/YYYY");
        if (!momentObj.isValid()) {
          console.log(`Invalid date format:${date}`);
          res.status(400).json({ error: "Invalid date format" });
          return;
        }

        const appointments = await Appointment.find({ doctorId, date });

        if (
          appointments &&
          Array.isArray(appointments) &&
          appointments.length > 0
        ) {
          const bookedTimes = appointments.map(
            (appointment) => appointment.time
          );
          const bookedDates = appointments.map(
            (appointment) => appointment.date
          );
          console.log("At if chck");

          res.status(200).json({ bookedDates, bookedTimes });
        } else {
          console.log("At emplty chck");
          res.status(200).json({ bookedDates: [], bookedTimes: [] });
        }
      } else {
        console.log("here at elselast");
        res.status(400).json({ error: "Invalid request parameters" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error" });
    }
  },
  getSingleDoctor: async (req, res) => {
    try {
      console.log("evide keri single");
      const { id } = req.params;

      console.log("eee id", id);
      if (id) {
        let doctor = await Doctors.findById(id);
        res.status(200).json({ response: doctor });
      }
    } catch (error) {
      console.log("eee ", error);
      res.status(400).json({ error: "Invalid data" });
    }
  },

  // app.post('/create-checkout-session', async (req, res) => {
  checkoutPayment: async (req, res) => {
    console.log("at checkout");
    const session = await stripe.checkout.sessions.create({
      line_items: [
        //till now rray cart items
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "T-shirt",
            },
            unit_amount: 2000,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      // success_url: 'http:/localhost:5713/success',
      // cancel_url: 'http:/localhost:5713/failure',

      success_url: `${process.env.CLIENT_URL}/success`,
      cancel_url: `${process.env.CLIENT_URL}/failure`,
    });
    res.send({ url: session.url });
  },
};
