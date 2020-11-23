let Message_Model = require('./message.model')
var ObjectId = require('mongodb').ObjectID;
let vm = require('v-response')


//Add message
exports.add = async (req, res, next) => {
		try{
			let body = req.body;
            const new_message = new Message_Model(body);
                      //console.log('Request', new_user)
					  new_message.save()
                        .then((saved) => {
                            if (!saved) {
                                return res.status(400)
                                    .json(vm.ApiResponse(false, 400, "An error occur please try again."));
                            } else {
                                return res.status(201)
                                    .json(vm.ApiResponse(true, 201, "We have received your message.", saved));
                            }
                        }).catch(error => {
                             if (error.name === 'MongoError' && error.code === 11000) {
                                var regex = /index\:\ (?:.*\.)?\$?(?:([_a-z0-9]*)(?:_\d*)|([_a-z0-9]*))\s*dup key/i,      
                                 match =  error.message.match(regex)
                                return  res.status(422).json(vm.ApiResponse(false, 500,match[1]+" already exist", error));
                              }
                              const messages = []
                              for (let field in error.errors) {
                                messages.push(error.errors[field].message)
                              }
                              
                              if(messages === undefined || messages.length == 0){
                                return res.status(500).json(vm.ApiResponse(false, 500, 'Something went wrong.', error));
                              }else{
                               return  res.status(500).json(vm.ApiResponse(false, 500, messages.join('<br/>'), error));
                              }
                      })
			}
			catch(e)
			{
				return res.status(500)
						.json(vm.ApiResponse(false, 500, e.message, undefined));
			}
};

exports.get = async(req, res, next) => {
	try{
		let body = req.body;
		var query = {"created":{ $gte:body.beginning, $lt:body.ending }};
		Message_Model.find(query)
					.then((response) => {
					if (!response) {
						return res.status(400)
							.json(vm.ApiResponse(false, 400, "No enquiries found"))
					} else {
						return res.status(200)
							.json(vm.ApiResponse(true, 200, "Fetched no of enquiries", response))
					}
				}).catch(error => {
					if (error.name === 'MongoError' && error.code === 11000) {
					   var regex = /index\:\ (?:.*\.)?\$?(?:([_a-z0-9]*)(?:_\d*)|([_a-z0-9]*))\s*dup key/i,      
						match =  error.message.match(regex)
					   return  res.status(422).json(vm.ApiResponse(false, 500,match[1]+" already exist", error));
					 }
					 const messages = []
					 for (let field in error.errors) {
					   messages.push(error.errors[field].message)
					 }
					 
					 if(messages === undefined || messages.length == 0){
					   return res.status(500).json(vm.ApiResponse(false, 500, 'Something went wrong.', error));
					 }else{
					  return  res.status(500).json(vm.ApiResponse(false, 500, messages.join('<br/>'), error));
					 }
			 })
	}
	catch(e)
	{
		return res.status(500)
              .json(vm.ApiResponse(false, 500, e.message, undefined));
	}
};

