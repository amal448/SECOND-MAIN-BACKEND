const jwt = require("jsonwebtoken");
const passwordHash = require("password-hash");
const cloudinary = require("../utils/cloudinary.js");
const Doctors = require("../model/Doctor");
const Users = require("../model/User");
const Departments = require("../model/Department.js");
const Applicant = require("../model/Doctorapply.js");
const {
  checkPasswordHasSpecialCharacters,
  EMAILREGEX,
  stringHasAnyNumber,
} = require("../utils/constants");
const { response } = require("express");
const { ObjectId } = require("mongodb");

module.exports = {
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

  addDoctor: (req, res) => {
    console.log("backcall...................");
    return new Promise((resolve, reject) => {
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
        password
      } = req.body;
      console.log(1);
      console.log(req.body);

      if (
        firstName == "" ||
        lastName == "" ||
        email == "" ||
        address == "" ||
        mobile == "" ||
        department == "" ||
        dob == "" ||
        image == "" ||
        password ==""
        //  experience == "" ||
      ) {
        for (const key in req.body) {
          if (req.body[key] == "") {
            errMessage={...errMessage,[key]:"please provide" + key}
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
        try {
          Doctors.findOne({ email:email }).then((response) => {
            if (response) {
              return res.status(409).json({ email: "username already exist" });
            } else {
              console.log("1doctorcheck");
              // console.log("res.body", response);

              req.body.password=passwordHash.generate(password)



              new Doctors({ ...req.body, block: false })
                .save()
                .then(async (response) => {
                  return res
                    .status(200)
                    .json({response, message: "Added to the mongoDataBase" });
                });
            }
          });
        } catch (error) {
          res.status(500).json({ err: "Something wrong here" });
        }
      }
    });
  },
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
      if (departments) {
        res.status(200).json(departments);
      } else {
        res.status(500).json({ err: "SOMETHING WRONG" });
      }
    } catch (error) {
      res.status(500).json({ err: "Something wrong here" });
    }
  },
  deleteDoctor: async (req, res) => {
    try {
      const { id } = req.params;
      const doctor = Doctors.findByIdAndUpdate(id, { Blocked: true });

      if (doctor) {
        const updatedDoctor = await Doctors.find({ Blocked: false });
        res.status(200).json({ doctors: updatedDoctor });
      }
      res.status(200).json(doctor);
    } catch (error) {
      res.status(500).json({ err: "can't delete the doctor" });
    }
  },

  deleteDepartment: async (req, res) => {
    try {
      const { id } = req.params;
      const Deldepartment = Departments.findByIdAndDelete(id);

      if (Deldepartment) {
        const departments = await Departments.find({});
        res.status(200).json(departments);
      } else {
        res.status(500).json({ err: "deletion failed" });
      }
    } catch (error) {
      res.status(500).json({ err: "can't delete department" });
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
  getApplicant: async (req, res) => {
    try {
      let applicant = await Applicant.find({});

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
      console.log("department",department);
      const lowerCaseDepartment = department.department.trim().toUpperCase();
     console.log( lowerCaseDepartment);
      const checkDepartment =await Departments.findOne({ lowerCaseDepartment })

    
      console.log("checkDepartment",checkDepartment);
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
            console.log(err);
            res.status(500).json({ err: "can't add department" });
          });
      } else {
        res.status(500).json({ err: "department already exists" });
      }
    } catch (error) {
      res.status(500).json({ ERR: "can't create department" });
    }
  },
  getApplicantData:async(req,res)=>{
    console.log("@getApplicant")
  console.log(req.params);
    const id=req.params.id
    console.log("@getApplicantid")

    console.log(id);
    Applicant.findById(id).then((response)=>{
      console.log("response123",response);
      res.status(200).json({doctorData:response})
    }).catch((error)=>{
      console.log("error is occured",error);
    })
  }

};

