
authRouter
POST /signup
POST /signin
POST /logout

profileRouter
GET / profile/view
PATCH /profile/editprofile
PATCH /profile/password

connectionRequestRouter
POST /request/send/interested/:userId
POST /request/send/ignored/:userId
POST /request/review/accepted/:requestId
POST /request/review/rejected/:requestId

userRouter
GET /connections
GET /feed = gets u the profiles of other users on the platform

status: ignore, interested, accepted, rejected
