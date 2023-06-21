import jwt from 'jsonwebtoken';


export const User_authentication = function (req, res, next) {
        try {
            const token = req.headers["authorization"];
       
            if (!token) {
                return res.status(401).send({ status: false, message: "token must be present" });
            }

            let splitToken = token.split(" ");

            // token validation.
            if (!token) {
                return res.status(400).send({ status: false, message: "token must be present" });
            }
          
            else {
                jwt.verify(splitToken[1],process.env.JWT_USER_TOKEN, function (err, data) {
                    if (err) {
                        return res.status(400).send({ status: false, message: err.message });
                    } else {
                        req.userId = data.userId;
                            next();
                    }
                });
            }
        } catch (error) {
            return res.status(500).send({ status: false, message: error.message });
        }
    };