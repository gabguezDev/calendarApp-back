const mongoose = require("mongoose");

const dbConnection = async () => {
	try {
		mongoose.set("strictQuery", false); // This line supress a console warning
		await mongoose.connect(process.env.DB_CNN);
		// {
		// 	useNewUrlParse: true,
		// 	useUnifyTopology: true,
		// 	useCreateIndex: true,
		// }
		console.log("DB ONLINE");
	} catch (error) {
		console.log(error);
		throw new Error("Error al inicializar la base de datos");
	}
};

module.exports = {
	dbConnection,
};
