/* Import mongoose and define any variables needed to create the schema */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/* Create your schema */
var usersSchema = new Schema({
  username: {
    type: String, 
    required: true,
    unique: true
  }, 
  email: {
    type: String, 
    required: true, 
    unique: true
  }, 
  password: {
      type: String, 
      required: true
  },
  isAdmin: {
    type: Boolean,
    required: true,
    default: false
  },
  name: {
    type: String,
    unique: true
  },
  role: {
    type: String,
    required: true
  },
  courses: [String],
  location: {
      latitude: Number,
      longitude: Number
  },
  linkedIn: {
    type: String,
    unique: true
  },
  twitter: {
    type: String,
    unique: true
  },
  officeHours: {
    type: [{
      alias: {
        type: String,
        unique: true,
        required: true
      },
      day: String,
      startTime: String,
      startCode: String,
      endTime: String,
      endCode: String,
      buildingCode: String,
      buildingNumber: String
    }]
  },
  lastBuilding: {
    type: String
  }
},
{
  usePushEach: true
}
);

/* create a 'pre' function that adds the updated_at (and created_at if not already there) property */
usersSchema.pre('save', function(next) {
  var currentTime = new Date;
  this.updated_at = currentTime;
  if(!this.created_at)
  {
    this.created_at = currentTime;
  }
  next();
});



var User = mongoose.model('User', usersSchema, 'users');

/* Export the model to make it avaiable to other parts of your Node application */
module.exports = User;