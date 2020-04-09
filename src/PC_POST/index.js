module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    if (req.query.count || (req.body && req.body.count)) {
        context.res.headers = { 'Content-Type':'application/json' };
        var res = {count: false};
        context.res = {
            // status: 200, /* Defaults to 200 */
            // body: "Hello " + (req.query.name || req.body.name)
            body: res
        };
    }
    else {
        context.res = {
            status: 400,
            body: "Please pass a name on the query string or in the request body"
        };
    }
};