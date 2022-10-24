const { gql } = require('graphql-tag');

module.exports = gql`
	scalar DateTime
  scalar JSON

  type Reservation {
    id: ID!
  }

  type Response {
    message: String!
    success: Boolean!
    data: JSON
  }

  type Query {
    reservations: [Reservation]
  }

	type Mutation {
    createReservation(unitId: ID!, guestName: String!, checkIn: DateTime!, checkOut: DateTime!): Response!
    updateReservation(reservationId: ID!, unitId: ID!, checkOut: String!): Response!
    cancelReservation(reservationId: ID!, unitId: ID!): Response!
	}
`;
