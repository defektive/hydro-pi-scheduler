//We wrap mongoose so that you don't have to include mongoose twice once in the mongoose rest and once here.
//If I where really smart I would figure out a better way.

module.exports = function(mongoose) {
    var Schema = mongoose.Schema;
    var StationSchema = new Schema({
        number:{type:Number},
        name:{type:String},
        description:{type:String},
        status:Boolean,
        enabled:Boolean
    });

    Station.pre('save', function (next) {
    	console.log("preSave");
        next();
    });

    var Station = mongoose.model('station', StationSchema);

    return Employee;
};