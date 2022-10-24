const { DateTimeResolver, JSONResolver } = require('graphql-scalars');

module.exports = {
	DateTime: DateTimeResolver,
	JSON: JSONResolver,

	Query: {
		reservations: async (parent, args, context) => {
			const { models } = context;
			// palaceholder query
			const reservations = await models.Reservation.query();
			return reservations;
		},
	},
	Mutation: {
		createReservation: async (parent, args, context) => {
			const { models, tuya } = context;
			const { Reservation } = models;
			const { guestName, unitId, checkIn, checkOut } = args;

			// check if unit is available
			const hasReservation = await Reservation.query()
				.where('unitId', unitId)
				.where('checkIn', '<=', checkIn)
				.where('checkOut', '>=', checkOut)
				.where('isCancelled', false)
				.first();

			if (hasReservation) {
				return {
					message: 'Unit is not available',
					success: false,
					data: null,
				};
			}

			// check if unit has a lock
			const lock = await models.Lock.query().findOne({ unitId });
			const checkInInSeconds = Math.floor(new Date(checkIn).getTime() / 1000);
			const checkOutInSeconds = Math.floor(new Date(checkOut).getTime() / 1000);
			if (lock) {
				// create access code
				const { passcode, id, error } = await tuya.createAccessCode({
					deviceId: lock.remoteDeviceId,
					checkIn: checkInInSeconds,
					checkOut: checkOutInSeconds,
				});
				console.log({ passcode, id, error });
				await models.AccessCode.query().insert({
					reservationId: reservation.id,
					lockId: lock.id,
					remotePasscodeId: id,
					passcode,
				});
			}

			// create reservation
			const reservation = await Reservation.query().insert({
				guestName,
				unitId,
				checkIn,
				checkOut,
			});
			return reservation;
		},

		updateReservation: async (_, args, context) => {
			const { models, tuya } = context;
			const { Reservation } = models;
			const { reservationId, checkOut } = args;

			// check if reservation exists
			const reservation = await Reservation.query().findById(reservationId);
			if (!reservation) {
				return {
					message: 'Reservation not found',
					success: false,
					data: null,
				};
			}

			// check if the reservation is cancelled
			if (reservation.isCancelled) {
				return {
					message: 'Reservation is cancelled, cannot update',
					success: false,
					data: null,
				};
			}

			// update reservation
			const updatedReservation = await Reservation.query()
				.findById(reservationId)
				.patch({ checkOut });

			// check if the unit has a lock
			const lock = await Lock.query().findOne({ unitId: reservation.unitId });
			// if there's a lock update the access code
			if (lock) {
				const checkInInSeconds = Math.floor(
					new Date(reservation.checkIn).getTime() / 1000,
				);
				const checkOutInSeconds = Math.floor(
					new Date(checkOut).getTime() / 1000,
				);
				const accessCode = await AccessCode.query()
					.findOne({ reservationId, lockId: lock.id })
					.patch({ checkOut });
				await tuya.updateAccessCode({
					deviceId: lock.remoteDeviceId,
					passcodeId: accessCode.remotePasscodeId,
					passcode: accessCode.passcode,
					checkIn: checkInInSeconds,
					checkOut: checkOutInSeconds,
				});
			}

			return {
				message: 'Reservation updated',
				success: true,
				data: updatedReservation,
			};
		},

		cancelReservation: async (_, args, context) => {
			const { models } = context;
			const { Reservation, AccessCode } = models;
			const { reservationId } = args;

			// check if reservation exists
			const reservation = await Reservation.query().findById(reservationId);
			if (!reservation) {
				return {
					message: 'Reservation not found',
					success: false,
					data: null,
				};
			}

			// update reservation
			const updatedReservation = await Reservation.query()
				.findById(reservationId)
				.patch({ isCancelled: true });

			// check if the unit has a lock
			const lock = await Lock.query().findOne({ unitId: reservation.unitId });
			// if there's a lock delete it
			if (lock) {
				// the cascade delete will take care of the access code
				const accessCode = await AccessCode.findOne({ lockId: lock.id });
				await tuya.deleteAccessCode({
					deviceId: lock.remoteDeviceId,
					accessCodeId: accessCode.remotePasscodeId,
				});
			}

			return {
				message: 'Reservation cancelled',
				success: true,
				data: updatedReservation,
			};
		},
	},
};
