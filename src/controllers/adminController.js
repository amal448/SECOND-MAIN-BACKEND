const jwt = require("jsonwebtoken");
const passwordHash = require("password-hash");
const Doctors = require("../model/Doctor");
const Users = require("../model/User");
const Departments = require("../model/Department.js");
const Applicant = require("../model/Doctorapply.js");
const moment=require("moment")
const nodemailer = require("nodemailer");
const {
  checkPasswordHasSpecialCharacters,
  EMAILREGEX,
  stringHasAnyNumber,
} = require("../utils/constants");
const { response } = require("express");
const { ObjectId } = require("mongodb");

module.exports = {
  //Admin Login

  login: async (req, res) => {
    const { username, password } = req.body;

    const errMessage = {
      username: "",
      password: "",
    };
    if (username == "" || password == "") {
      for (const key in req.body) {
        if (req.body[key] == "") {
          errMessage[key] = "please provide " + key;
        } else {
          delete errMessage[key];
        }
      }
      return res.status(406).json({ ...errMessage });
    }
    if (process.env.ADMIN_USERNAME == username) {
      if (process.env.ADMIN_PASSWORD == password) {
        const token = await jwt.sign({ username, password }, process.env.KEY);
        return res.status(200).json({ token });
      } else {
        return res.status(401).json({ password: "password is incorrect" });
      }
    } else {
      return res.status(401).json({ username: "username is invalid" });
    }
  },

  addDoctor: async (req, res) => {
    console.log("backcall...................");
    try {
      const errMessage = {
        firstName: "",
        lastName: "",
        email: "",
        mobile: "",
        dob: "",
        image: "",
        address: "",
        department: "",
        password: "",
        fees: "",
        about: "",
        experience: "",
        startTime:"",
        endTime:""
      };
      const {
        firstName,
        lastName,
        dob,
        email,
        mobile,
        department,
        address,
        image,
        password,
        fees,
        about,
        experience,
        startTime,
        endTime
      } = req.body;
      console.log(1);
      console.log(req.body);
  
      const formattedStartedTime= moment(startTime,"hh:mmA").format("H")
      const formattedEndTime=moment(endTime,"hh:mmA").format("H");
  
      console.log("LLLLLLLLLLLLLLLLLLL")
      console.log(formattedStartedTime);
      console.log(formattedEndTime);
  
      function getTimesBetween(start,end){
        const times=[]
        let currentTime =moment(start);
  
        while(currentTime.isBefore(end)) {
          times.push(currentTime.format("h:mm A"))
          currentTime.add(1,'hour')
        }
  
        return times;
      }
  
      const timings= getTimesBetween(formattedStartedTime ,formattedEndTime)
  
      if (
        firstName == "" ||
        lastName == "" ||
        email == "" ||
        address == "" ||
        mobile == "" ||
        department == "" ||
        dob == "" ||
        image == "" ||
        password == "" ||
        experience == "" ||
        fees == "" ||
        about == ""
      ) {
        for (const key in req.body) {
          if (req.body[key] == "") {
            errMessage[key] = "please provide" + key;
          } else {
            delete errMessage[key];
          }
        }
        console.log(2);
        return res.status(406).json({ ...errMessage, ok: false });
      } else {
        console.log(1);
  
        // if (!EMAILREGEX.test(email)) {
        //   return res.status(406).json({ email: "invalid email " });
        // }
  
        // if (!stringHasAnyNumber(mobile)) {
        //   return res.status(406).json({ mobile: "invalid mobile " });
        // }
        console.log(2);
  
        const response = await Doctors.findOne({ email: email });
        if (response) {
          return res.status(409).json({ email: "username already exists" });
        } else {
          console.log("1doctorcheck");
          // console.log("res.body", response);
  
          req.body.password = passwordHash.generate(password);
  
          await new Doctors({ ...req.body, block: false, timings, status: "Approved" }).save();
  
          return res
            .status(200)
            .json({ response, message: "Added to the mongoDataBase" });
        }
      }
    } catch (error) {
      return res.status(500).json({ err: "Something went wrong" });
    }
  },
  
  // Get All Doctor
  getallDoctors: (req, res) => {
    Doctors.find({}).then((response) => {
      console.log("heloo");
      res.status(200).json({ allDoctors: response });
    });
  },

  getallUsers: (req, res) => {
    Users.find({}).then((response) => {
      console.log("getallUser", response);
      res.status(200).json({ alluser: response });
    });
  },

  getAllDepartments: async (req, res) => {
    try {
      const departments = await Departments.find({});
      console.log("departments", departments);
      if (departments) {
        res.status(200).json(departments);
      } else {
        res.status(500).json({ err: "SOMETHING WRONG" });
      }
    } catch (error) {
      res.status(500).json({ err: "Something wrong here" });
    }
  },

  // deleteDepartment: async (req, res) => {
  //   try {
  //     console.log("emtered @admin deldep");
  //     const { id } = req.params;
  //     console.log(id);
  //     const Deldepartment = await Departments.findByIdAndDelete(id);

  //     if (Deldepartment) {
  //       const departments = await Departments.find({});
  //       console.log(departments);
  //       res.status(200).json(departments);
  //     } else {
  //       res.status(500).json({ err: "deletion failed" });
  //     }
  //   } catch (error) {
  //     res.status(500).json({ err: "can't delete department" });
  //   }
  // },

  editDepartment:async(req,res)=>{
    console.log("kakakakakakakakakakakakakasiwediuwduhdoiwdhoiho")
    try{

      const {id} =req.params

        const updatedepartment=await Departments.findById(id)
        re.json.status(200).json({response:updatedepartment})
      
    }
    catch(error)
    {
      res.status(500).json({ err: "can't edit department" });

    }
  },

  blockUser: async (req, res) => {
    await Users.updateOne({ _id: new ObjectId(req.params.id) }, [
      {
        $set: {
          block: {
            $cond: {
              if: { $eq: ["$block", true] },
              then: false,
              else: true,
            },
          },

        },
      },
    ]).then((result) => {
      console.log(result);
      res.status(200).json({ ok: true });
    });
  },
  
  blockDoctor: async (req, res) => {
    await Doctors.updateOne({ _id: new ObjectId(req.params.id) }, [
      {
        $set: {
          block: {
            $cond: {
              if: { $eq: ["$block", true] },
              then: false,
              else: true,
            },
          },
          status:{
            $cond:{
              if:{$eq:["$block",true]},
              then:"Rejected",
              else:"Approved"
            }
          }
        },
      },
    ]).then((result) => {
      console.log(result);
      res.status(200).json({ ok: true });
    });
  },
  getApplicant: async (req, res) => {
    try {
      let applicant = await Doctors.find({ block: true });

      if (applicant) {
        res.status(200).json(applicant);
        console.log("applicant", applicant);
      } else {
        return res.status(500).json({ err: "blocking failed" });
      }
    } catch {
      res.status(500).json({ err: "error is occured" });
    }
  },

  editUser: (req, res) => {
    const userId = req.params.id;
    const updatedData = req.body;

    Users.findByIdAndUpdate(
      userId,
      updatedData,
      { new: true },
      (error, user) => {
        if (error) {
          console.log("Error in editing user", error);
          return res.status(406).json({ error: "Failed to edit user" });
        }
        if (!user) {
          return res.status(406).json({ error: "Users not found" });
        }

        return res.json({ message: "User updated successfully", user });
      }
    );
  },

  deleteUser: (req, res) => {
    let userId = req.params.id;
    let updateddata = req.body;
    Doctors.findByIdAndDelete(
      userId,
      updateddata,
      { new: true },
      (error, user) => {
        if (error) {
          console.log("Error in deleting user", error);
          return res.status(406).json({ error: "Failed to delete user" });
        }
        if (!user) {
          return res.status(406).json({ error: "Users not found" });
        }
        return res.json({ message: "Deleted the User SuccessFully", user });
      }
    );
  },
  editDoctor: (req, res) => {
    let doctorError = {
      CTC: "",
      age: "",
      department: "",
      email: "",
      experience: "",
      mobile: "",
      username: "",
      id: "",
    };
    let { CTC, age, department, email, experience, mobile, username, _id } =
      req.body;

    if (
      CTC == "" ||
      experience == "" ||
      age == "" ||
      username == "" ||
      email == "" ||
      mobile == "" ||
      department == ""
    ) {
      for (const key in req.body) {
        if (req.body[key] == "") {
          doctorError[key] = "please provide ";
        } else {
          delete doctorError[key];
        }
      }
      res.status(406).json({ ...doctorError });
      return;
    } else {
      if (mobile.length > 10 || mobile.length < 10) {
        res.status(406).json({ mobile: "please provide valid " });
        return;
      }
      try {
        Doctors.findOne({ username }).then((response) => {
          if (response && response._id != _id) {
            return res.status(409).json({ username: "already exist " });
          } else {
            Doctors.updateOne(
              { _id: new ObjectId(_id) },
              {
                $set: {
                  CTC,
                  age,
                  department,
                  email,
                  experience,
                  mobile,
                  username,
                },
              }
            ).then((response) => {
              res.status(200).json({ ok: true });
            });
          }
        });
      } catch (error) {
        console.log(error);
      }
    }
  },
  getDoctor: (req, res) => {
    const { id } = req.params;
    Doctors.findById(id).then((response) => {
      delete response.password;
      res.status(200).json({ doctor: response });
    });
  },
  addDepartment: async (req, res) => {
    try {
      const department = req.body;
      console.log("department", department);
      const lowerCaseDepartment = department.department.trim().toUpperCase();
      console.log(lowerCaseDepartment);
      const checkDepartment = await Departments.findOne({
        department: lowerCaseDepartment,
      });

      if (!checkDepartment) {
        const newDepartment = new Departments({
          department: lowerCaseDepartment,
        });

        newDepartment
          .save()
          .then(async () => {
            const departments = await Departments.find({});
            res.status(200).json(departments);
          })
          .catch((err) => {
            console.log(err, "can't add department");
            res.status(500).json({ err: "can't add department" });
          });
      } else {
        console.log("department already exists");
        res.status(500).json({ err: "department already exists" });
      }
    } catch (error) {
      res.status(500).json({ ERR: "can't create department" });
    }
  },
  getApplicantData: async (req, res) => {
    console.log("@getApplicant");
    console.log(req.params);
    const id = req.params.id;
    console.log("@getApplicantid");

    console.log(id);
    Doctors.findById(id)
      .then((response) => {
        console.log("response123", response);
        res.status(200).json({ doctorData: response });
      })
      .catch((error) => {
        console.log("error is occured", error);
      });
  },

  doctorApproval: async (req, res) => {
    try {
      console.log("reached doctor Approval");
      const { id } = req.params;
      console.log(id);
      const approveDoctor = await Doctors.findByIdAndUpdate(
        { _id: id },
        { block: false },
        {status:"Approved"}
      );

      if (approveDoctor) {
        console.log("approve", approveDoctor);

        let testAccount = await nodemailer.createTestAccount();

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
        let info = await transporter.sendMail({
          from: process.env.EMAIL, // sender address
          to: approveDoctor?.email, // list of receivers
          subject: "Doctor Applcation Approved by Admin", // Subject line
          // text: "Hello world?", // plain text body
          html: "<b>Hello world?</b>", // html body
        });

        // console.log("Message sent: %s", info.messageId);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

        // Preview only available when sending through an Ethereal account
        // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
      }

      // main().catch(console.error);

      res
        .status(200)
        .json({ success: "doctor application approved successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ err: "unable to update the data" });
    }
  },

  RejectApproval: async (req, res) => {
    console.log("entered reject");
    try {
      const { id } = req.params;
      console.log(id);
      // const rejectDoctor = await Doctors.findByIdAndDelete(id);
      const rejectDoctor = await Doctors.findByIdAndUpdate( { _id: id },
        { block: true },
        {status:"Rejected"})

      console.log("rejectDoctor", rejectDoctor);
      if (rejectDoctor) {
        console.log("reject", rejectDoctor);

        let testAccount = await nodemailer.createTestAccount();

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
        let info = await transporter.sendMail({
          from: process.env.EMAIL, // sender address
          to: rejectDoctor?.email, // list of receivers
          subject: "Doctor Application was Rejected by Admin", // Subject line
          // text: "Hello world?", // plain text body
          html: "<b>Hello world?</b>", // html body
        });

        // console.log("Message sent: %s", info.messageId);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

        // Preview only available when sending through an Ethereal account
        // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
      }
    } catch (error) {
      res.status(500).json({ faied: "The Request is deleted successfully" });
    }
  },
  deleteDoctor: async (req, res) => {
    try {
      const { id } = req.params;
      const doctor = Doctors.findByIdAndUpdate(id, { block: true });

      if (doctor) {
        const updatedDoctor = await Doctors.find({ block: false });
        res.status(200).json({ doctors: updatedDoctor });
      }
      res.status(200).json(doctor);
    } catch (error) {
      res.status(500).json({ err: "can't delete the doctor" });
    }
  },
};
