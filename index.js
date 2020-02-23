const item = {
    itemId: '02bbdbc7-e22e-4153-abd8-b5732a4ba6b5',
    name: 'Ball cap',
    description: 'Drake stuff',
    price: 19.99,
    size: 'Large'
};

const firstName = 'Jason';
const lastName = 'Bradley';

const customer = {
    firstName,
    lastName,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@drake.edu`,
    phoneNumber: '+15155555555'
};

console.log('item', item);
console.log('customer', customer);

const Hapi = require('@hapi/hapi');
const uuid = require('uuid');

const init = async () => {

     const server = Hapi.server({
     };		         port: 3000,
             host: 'localhost'
         });

         const BillId = uuid.v4();
         const customerBill = {
                customerId: BillId,
                name: 'Bill',
                age: 70
         };

         const customerJeff = {
                  customerId: uuid.v4(),
                  name: 'Jeff',
                  age: 25
          };

           const customerDavid = {
                   customerId: uuid.v4(),
                   name: 'David',
                   age: 65
               };

            let customers = [customerBill, customerJeff, customerDavid];

            server.route({
                     method: 'GET',
                     path: '/customers',
                     handler: (request, h) => {
                         return customers;
                     }
                 });

      server.route({
         method: 'GET',
         path: '/customers/{customerId}',
         handler: (request, h) => {
             const {customerId} = request.params;
             const customer = customers.find((cust) => cust.customerId === customerId);

              if (!customer) {
                 return h.response().code(404);
             }

              return customer;
         }
     });

      server.route({
         method: 'POST',
         path: '/customers',
         handler: (request, h) => {
             const customer = request.payload;
             const existingCust = customers.find((cust) => cust.customerId === customer.customerId);

              if (existingCust) {
                 return h.response(existingCust).code(303);
             } else {
                 customers.push(customer);

                  return h.response(customer).code(201);
             }

          }
     });

       server.route({
              method: 'DELETE',
              path: '/customers/{customerId}',
              handler: (request, h) => {
                  const {customerId} = request.params;
                  const customer = customers.find((cust) => cust.customerId === customerId);
                if (!customer) {
                    return h.response().code(404);
                    }

                    let newcustomers = [];

                     customers.forEach((cust) => {
                                     if (cust.customerId !== customerId) {
                                         newcustomers.push(cust);
                                     }
                                 });

                                  customers = newcustomers;

                                  return '';
                             }
                         });

                          server.route({
                             method: 'PUT',
                             path: '/customers/{customerId}',
                             handler: (request, h) => {
                                 const {customerId} = request.params;
                                 const updatedcustomer = request.payload;

                                  if (customerId === BillId && updatedcustomer.age !== 70) {
                                     return h.response().code(422);
                                 }

                                  if (customerId !== updatedcustomer.customerId) {
                                     return h.response().code(409);
                                 }

                                  let newcustomers = [];

                                  customers.forEach((cust) => {
                                     if (cust.customerId === customerId) {
                                         newcustomers.push(updatedcustomer);
                                     } else {
                                         newcustomers.push(cust);
                                     }
                                 });

                                  customers = newcustomers;

                                  return '';
                             }
                         });

                          await server.start();
                         console.log('Server running on %s', server.info.uri);
                     };

                     process.on('unhandledRejection', (err) => {

                            console.log(err);
                                process.exit(1);
                            });

                             init();
