const passwordHash = require("password-hash");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
require("dotenv").config();
const Appointment = require("../model/appointment");
const Users = require("../model/User");
const Doctors = require("../model/Doctor");
const Departments = require("../model/Department");
const moment = require("moment");
const mongoose = require("mongoose");

const Stripe = require("stripe");
require("dotenv").config();
const stripe = Stripe(process.env.STRIPE_KEY);

const {
  EMAILREGEX,
  checkPasswordHasSpecialCharacters,
  stringHasAnyNumber,
} = require("../utils/constants");
const { checkPassword } = require("../helpers/userHelper");
const Appointments = require("../model/appointment");
const Prescription = require("../model/Prescription");
const { ObjectId } = require("mongodb");

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
      image: "",
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
      image,
    } = req.body;

    if (
      firstName == "" ||
      lastName == "" ||
      email == "" ||
      mobile == "" ||
      dateOfBirth == "" ||
      gender == "" ||
      password == "" ||
      confirmPassword == "" ||
      image == ""
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

    try {
      console.log("popoppopoppopoppopppopopop");
      Users.find({ email }).then((foundUsers) => {
        if (foundUsers.length > 0) {
          return res.status(409).json({ email: "email already exist" });
        } else {
          req.body.password = passwordHash.generate(password);

          delete req.body.confirmPassword;
          console.log("in try", req.body);

          console.log(
            "1111111111",
            process.env.EMAIL,
            process.env.EMAIL_TEST_APP_PSWD
          );

          new Users({ ...req.body, block: false, active: false })
            .save()
            .then(async (savedUser) => {
              delete req.body.password;

              // let testAccount = await nodemailer.createTestAccount();

              // create reusable transporter object using the default SMTP transport
              console.log(
                "1111111111",
                process.env.EMAIL,
                process.env.EMAIL_TEST_APP_PSWD
              );
              let transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 465,
                secure: true,
                service: "gmail",
                auth: {
                  user: "amalreact1@gmail.com", // generated ethereal user
                  pass: "tollbcuapfzqyvmh", // generated ethereal password
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
                // html: `<b>click to the link for verification https://celadon-blancmange-e713f5.netlify.app/activate-account/${newtoken}</b>`, // html body
                
              });
              res.status(200).json({ ok: true, message: "check your email" });
            })
            .catch((error) => {
              console.log("error .catch", error);
              res.send(500, { message: "Error occured", error, ok: false });
            });
        }
      });
    } catch (error) {
      console.log(error);
    }
  },



  // Contactemail:async(req,res)=>{

  //   let result=req.body
  //   console.log(result)
  //   let email=result.email
  //   try {
  //     console.log("popoppopoppopoppopppopopop");
  //     Users.find({ email }).then((foundUsers) => {
  //       if (foundUsers.length > 0) {
  //         // return res.status(409).json({ email: "email already exist" });
            
  //         console.log("in try", req.body);
        
  //             let transporter = nodemailer.createTransport({
  //               host: "smtp.gmail.com",
  //               port: 465,
  //               secure: true,
  //               service: "gmail",
  //               auth: {
  //                 user:email, // generated ethereal user
  //                 pass: "tollbcuapfzqyvmh", // generated ethereal password
  //               },
  //             });

  //             // send mail with defined transport object
             
  //             let info =  transporter.sendMail({
  //               from:  email, // sender address
  //               to:process.env.EMAIL, // list of receivers
  //               subject: "Enquiry", // Subject line
  //               // text: "Hello world?", // plain text body
  //               html: req.body.description
  //             });

  //             res.status(200).json({ ok: true, message: "check your email" });
  //           }})
  //           .catch((error) => {
  //             console.log("error .catch", error);
  //             res.send(500, { message: "Error occured", error, ok: false });
  //           });
    
  //       }catch (error) {
  //         console.log(error);
  //       }
     
  //   } ,

   Contactemail : async (req, res) => {
    try {
      let result = req.body;
      console.log(result);
      let email = result.email;
  
      console.log("popoppopoppopoppopppopopop");
      const foundUsers = await Users.find({ email });
  
      if (foundUsers.length > 0) {
        let transporter = nodemailer.createTransport({
          host: "smtp.gmail.com",
          port: 465,
          secure: true,
          service: "gmail",
          auth: {
            user: process.env.EMAIL, // admin's email
            pass: "tollbcuapfzqyvmh", // admin's app password
          },
        });
        
        const textBody = `UserName: ${result.UserName}\nemail: ${result.email}\n message: ${result.description}`;

        // send mail with defined transport object
        let info = await transporter.sendMail({
          from:result.email, // sender address
          to: process.env.EMAIL, // list of receivers
          subject: "Enquiry", // Subject line
          text: textBody, // plain text body
          // html: result,
        });
  
        res.status(200).json({ ok: true, message: "Check your email" });
      } else {
        res.status(409).json({ email: "Email not found" });
      }
    } catch (error) {
      console.log("Error:", error);
      res.status(500).json({ message: "Error occurred", error, ok: false });
    }
  },
  





  login: (req, res) => {
    console.log("kkfkkdmmdmmlmlml");
    try {
      const { email, password } = req.body;
      console.log("email", email);
      console.log("password", password);

      console.log(email, password);
      if (email == "" || password == "") {
        return res
          .status(406)
          .json({ message: "please provide valid details" });
      }
      Users.find({ email, block: false }).then(async (user) => {
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
      return res.status(400).json({ message: error.message });
    }
  },
  getAllDoctors: (req, res) => {
    return new Promise((resolve, reject) => {
      Doctors.find({}).then((res) => {
        console.log(res);
        for (let i = 0; i < res.length; i++) {
          console.log(res[i]);
          delete res[i].password;
        }
        res.status(200).json({ doctors: res });
      });
    });
  },
  getDepartments: async (req, res) => {
    console.log("@getDepartment");
    try {
      const department = await Departments.find({});
      console.log("department", department);
      if (department) {
        res.status(200).json({ res: department });
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
  activetidtoken: (req, res) => {
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>new");
    let { token } = req.params;
    let { userid } = req.params;
    console.log("userid", userid);

    token = token.replace(/\$/g, ".");
    console.log(token);

    try {
      const { email } = jwt.decode(token);
      Users.updateOne({ email }, { $set: { active: true } })
        .then((result) => {
          res.status(200).json({ ok: true, message: "useractivated", token });
        })
        .catch((error) => {
          res
            .status(500)
            .json({ ok: false, message: "Error updating user", error });
        });
      // Users.updateOne
    } catch (error) {
      res.status(400).json({ ok: false, message: "Invalid token", error });
    }
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
      res.status(200).json({ res: mostExperiencedDoctors });
    } catch (error) {
      console.log(error);
      res.status(500).json("Some error is happened here");
    }
  },
  getdepartmentdoctors: async (req, res) => {
    console.log("@getdepartmentfoctor");
    console.log(req.params.department);
    console.log(req.params.page);

    try {
      const { department } = req.params;
      const { page, perPage } = req.params;

      const options = {
        page: Number(page) || 1,
        limit: Number(perPage) || 2,
      };
      console.log("dep ", department);
      const departmentDoctors = await Doctors.paginate(
        {
          department,
          block: false,
        },
        options
      );
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
        res.status(400).json({ error: "Invalid req parameters" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error" });
    }
  },
  getSingleDoctor: async (req, res) => {
    try {
      console.log("evide keri single doctor");
      const { id } = req.params;

      console.log("eee id", id);
      if (id) {
        let doctor = await Doctors.findById(id);
        res.status(200).json({ res: doctor });
      }
    } catch (error) {
      console.log("eee ", error);
      res.status(400).json({ error: "Invalid data" });
    }
  },

  // app.post('/create-checkout-session', async (req, res) => {
  checkoutPayment: async (req, res) => {
    console.log("at checkout");

    try {
      const line_items = req.body;

      const usdToInrRate = 100;
      const usdAmount = line_items?.price;
      const inrAmount = usdAmount * usdToInrRate;

      console.log("at try");

      const customer = await stripe.customers.create({
        metadata: {
          userId: line_items.userId,
          appointments: JSON.stringify(line_items),
        },
      });

      const session = await stripe.checkout.sessions.create({
        line_items: [
          //till now rray cart items
          {
            price_data: {
              currency: "inr",
              product_data: {
                name: line_items?.doctor,
                images: [line_items?.doctorImage],
                description: line_items?.name,
                metadata: {
                  id: line_items?.doctorId,
                },
              },
              unit_amount: inrAmount,
            },
            quantity: 1,
          },
        ],

        customer: customer.id,
        mode: "payment",
        success_url: `${process.env.CLIENT_URL}/success`,
        cancel_url: `${process.env.CLIENT_URL}/failure`,
      });
      res.send({ url: session.url });
    } catch (error) {
      console.log("error", error);
      res.status(500).json(error);
    }
  },

  // Use this sample code to handle webhook events in your integration.

  // This is your Stripe CLI webhook secret for testing your endpoint locally.
  // whsec_26bfada796f5ae6ea48ffc9325cd5c07dd4ef084893a5b2b6285327d16f011fc

  webhook: async (req, res) => {
    console.log("webhook,,,,,,,,,,,,,,,,,,,,");
    let endpointSecret =
      "whsec_26bfada796f5ae6ea48ffc9325cd5c07dd4ef084893a5b2b6285327d16f011fc";
    const sig = req.headers["stripe-signature"];

    let data;
    let eventType;

    if (endpointSecret) {
      console.log("at webhookkkkkkkkkkkkkkkkkkk");
      const payload = req.body;
      const payloadString = JSON.stringify(payload, null, 2);
      const header = stripe.webhooks.generateTestHeaderString({
        payload: payloadString,
        secret: endpointSecret,
      });
      let event;

      try {
        console.log("at webhookkkkk tryyyyyyyyyyy");

        event = stripe.webhooks.constructEvent(
          payloadString,
          header,
          endpointSecret
        );
        console.log(
          "Webhook verifieddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd"
        );
      } catch (err) {
        console.log(
          `Webhook Errorrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr: ${err.message}`
        );
        res.status(400).send(`Webhook Error: ${err.message}`);
        return;
      }
      data = event.data.object;
      eventType = event.type;
    } else {
      console.log("at webhookkkkk else");

      data = req.body.data.object;
      eventType = req.body.type;
    }
    // Handle the event
    console.log("Handle the event");

    if (eventType === "checkout.session.completed") {
      stripe.customers
        .retrieve(data.customer)
        .then((customer) => {
          console.log("customer", customer);

          const appointmentsData = JSON.parse(customer.metadata.appointments);

          const newAppointment = new Appointment({
            userId: customer?.metadata?.userId,
            doctorId: appointmentsData?.doctorId,
            doctorName: appointmentsData?.doctor,
            doctorImage: appointmentsData?.doctorImage,
            department: appointmentsData?.doctorsDepartment,
            date: appointmentsData?.date,
            time: appointmentsData?.time,
            price: appointmentsData?.price,
            payment_status: data?.payment_status,
            paymentOwner: data?.customer_details?.email,
          });

          newAppointment.save();
          console.log("newAppointment");

          console.log(customer);
          console.log("data", data);
        })
        .catch((err) => {
          console.log(err.message);
        });
    }

    // Return a 200 res to acknowledge receipt of the event
    res.send().end;
  },

  RazorPayment: async (req, res) => {
    console.log("at Razor checkout");

    const data = req.body;
    console.log(data);
    try {
      // const line_items=req.body

      // const usdToInrRate=100;
      // const usdAmount=line_items?.price;
      // const inrAmount =usdAmount * usdToInrRate

      console.log("at try");

      console.log("data", data);

      const {
        doctor,
        userId,
        doctorId,
        doctorImage,
        doctorsDepartment,
        date,
        time,
        price,
        userName,
        useremail,
      } = data;

      const newAppointment = new Appointment({
        userId: userId,
        doctorId: doctorId,
        doctorName: doctor,
        doctorImage: doctorImage,
        department: doctorsDepartment,
        date: date,
        time: time,
        price: price,
        payment_status: "paid",
        status: "pending",
        paymentOwner: userName,
        paymentOwnerEmail: useremail,
      });

      newAppointment.save();
      console.log("newAppointment");

      res.status(200).json({ message: "Appointment created successfully" });
    } catch (error) {
      console.log("error", error);
      res.status(500).json(error);
    }
  },

  forgotPassword: async (req, res) => {
    const { email } = req.body;
    console.log("forepdokkkkkkkkkkkk");
    console.log(req.body);

    try {
      console.log("is here");
      let user = await Users.findOne({ email });
      if (!user) {
        return res.status(500).json({ err: "No user exists with this email" });
      }
      const userObject = user.toObject();
      const secret = user.password + process.env.KEY;
      console.log("user._id", user._id);

      // const token =jwt.sign({email:user.email,id:user._id},secret,{
      //   // expiresIn:"30m"
      // })
      const token = await String(
        jwt.sign(
          { email: userObject.email, id: userObject._id },
          secret
          // {
          //  expiresIn:"30m"
          //    }
        )
      );

      // console.log("token",token)
      let newtoken = token.replace(/\./g, "$");
      console.log("token", newtoken);
      console.log("user._id", user._id);

   /////now put forgot urllll
   const link = `<a href="https://celadon-blancmange-e713f5.netlify.app/foractivate-account/${user._id}/${newtoken}">Click to reset password </a>`;

      // const link = `<a href="${process.env.CLIENT_URL}/foractivate-account/${user._id}/${newtoken}">Click to reset password </a>`;

      let testAccount = await nodemailer.createTestAccount();

      let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        service: 'gmail',
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
          user: process.env.EMAIL, // generated ethereal user
          pass: process.env.EMAIL_TEST_APP_PSWD, // generated ethereal password
        },
      });

      // send mail with defined transport object

      let info = await transporter.sendMail({
        from: process.env.EMAIL, // sender address
        to: email, // list of receivers
        subject: "Reset Password", // Subject line
        // text: "Hello world?", // plain text body
        html: link, // html body
      });
      res.status(200).json({ res:true});
    } catch (error) {
      console.log("is here error");
      console.log(error);

      res.status(500).json({ error: "Somthing Error" });
    }
  },
  resetPassword: async (req, res) => {
    try {
      console.log("hwlwlwlwlwlwlwlw");

      const { userId, token } = req.params;
      let { password } = req.body;

      console.log("passworddddddddddd", password);
      console.log(userId);
      console.log("token", token);

      let newtoken = token.replace(/\./g, "$");
      console.log("newtoken", newtoken);

      password = passwordHash.generate(password);
      const user = await Users.findByIdAndUpdate(userId, { password });

      if (!user) {
        console.log("userrr if", user);
        return res.status(406).json({ err: "Not verified" });
      } else {
        console.log("userrr else", user);

        return res.status(200).json({ ok: true, newtoken });
      }
    } catch (error) {
      console.log("error", error);
      console.log("eoeoeoeoeoeoeoeo");

      return res.status(406).json({ err: "Reset password failed" });
    }
  },

  getUser: (req, res) => {
    console.log(
      "00000000000000000000000000000000000000000000000000000000000000000000000000"
    );
    try {
      const { userId } = req.params;
      console.log("id", userId);
      Users.find({ _id: userId })
        .then((response) => {
          console.log(
            "poooooooooooooooooooooooooooooooooooooooooooooo",
            response
          );
          res.status(200).json({ alluser: response });
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    }
  },
  bookhistory: async (req, res) => {
    try {
      const userId = req.params;
      console.log("userId", userId);
      let Appointmentdata = await Appointments.find(userId);

      console.log(Appointmentdata);
      res.send(Appointmentdata);
    } catch (error) {
      console.log(error);
    }
  },
  updateAppointment: async (req, res) => {
    // const approveDoctor = await Doctors.findByIdAndUpdate(
    //   { _id: id },
    //   { block: false },
    //   {status:"Approved"}
    // );
  },
  getPrescription: async (req, res) => {
    try {
      const user = req.params;
      console.log("Type of user:", typeof user);
      const userId = req.params.userId;
      console.log("User ID:", userId);
      console.log("Type of userId:", typeof userId);

      const prescriptionsWithDoctors = await Prescription.aggregate([
        {
          $match: { userId: new ObjectId(userId) }, // Use mongoose.Types.ObjectId with new keyword
        },
        {
          $lookup: {
            from: "doctors", // The name of the Doctor collection
            localField: "doctorId",
            foreignField: "_id",
            as: "doctor",
          },
        },
        {
          $unwind: "$doctor",
        },
        {
          $project: {
            _id: 1,
            userId: 1,
            doctorId: 1,
            username: 1,
            title: 1,
            description: 1,
            createdAt: 1,
            updatedAt: 1,
            __v: 1,
            doctorName: "$doctor.firstName",
            department: "$doctor.department", // Add the doctor's name to the prescription object
          },
        },
      ]);

      console.log("prescriptionsWithDoctors", prescriptionsWithDoctors);

      if (prescriptionsWithDoctors.length > 0) {
        res.status(200).json({ getPrescription: prescriptionsWithDoctors });
      } else {
        res.status(401).json({ msg: "Prescriptions not found" });
      }
    } catch (error) {
      console.log("Error:", error);
      res.status(500).json({ msg: "Internal server error" });
    }
  },
  getDoctor:async (req, res) => {
    console.log("00000000000000000000000000000000000000000000000000000000000000000000000000")
    try{
      
      const {doctorId} =req.params
      console.log("doctorId121",doctorId)
      Doctors.find({ _id: doctorId }).then((response) => {
        console.log("poooooooooooooooooooooooooooooooooooooooooooooo", response);
        res.status(200).json({ doctor: response });
      }).catch((err)=>{
        console.log(err)
      });
    }
    catch(error)
    {
      console.log(error)
    }

},
};
