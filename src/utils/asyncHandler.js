const asyncHandler = (controller)=>{
    return (req, res, next)=>{
        Promise.resolve(controller(req, res, next)).catch(next);
    }
}

export default asyncHandler;

// therefore here, the controller is just a function which is being passed to the asynchandler callback function. now we know controller or the passed funciton will return a promise which needs to be handled - resolved or rejected. now when the HTTP request is called, the req, res gets passed to the controller and the controller function runs. The output is the Promise which is returned inside another callback funciton which has req, res, next BECAUSE THE EXPRESS GET/POST APIS REQUIRE A PATH AND A CALLBACK FUNCTION WITH THE REQ, RES LIFECYCLE

// essestially this is being returned in asyncHandler:

// (req, res, next) => {
//     Promise.resolve(
//         controller(req, res, next)
//     ).catch(next);
// } 