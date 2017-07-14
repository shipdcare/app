angular.module('starter.services', [])

.factory('Rewards', function() {

  var rewards = [{
    id: 0,
    name: 'Book My Show Tickets for 2',
    outlet: 'BMS',
    face: 'img/ben.png',
    points: 10,
    description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry when an unknown printer took a galley of type and scrambled it to make a type specimen book.'
  }, {
    id: 1,
    name: '20% off on lunch buffet',
    outlet: 'Barbeque Nation',
    face: 'img/max.png',
    points: 50,
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English."
  }, {
    id: 2,
    name: 'Mobile recharge of Rs. 200',
    outlet: 'Airtel',
    face: 'img/adam.jpg',
    points: 50,
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English."
  }, {
    id: 3,
    name: 'Free shake worth Rs. 150',
    outlet: 'Dunkin Donuts',
    face: 'img/perry.png',
    points: 100,
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English."
  }, {
    id: 4,
    name: '20% off at any of our partner stores',
    outlet: 'ROB',
    face: 'img/mike.png',
    points: 400,
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English."
  }];

  return {
    all: function() {
      return rewards;
    },
    get: function(rewardId) {
      for (var i = 0; i < rewards.length; i++) {
        if (rewards[i].id === parseInt(rewardId)) {
          return rewards[i];
        }
      }
      return null;
    }
  };
})

.factory('Stores', function() {

   var stores =  [{
    id: 0,
    name: 'Foodsbury',
    address: '3234 Main Street',
    locality: 'Vasant Vihar',
    face: 'http://www.futomicdesigns.com/images/restaurant-interiors/big/best-restaurant-interiors-designer-02.jpg',
    offer: "Upto 70% off on desserts",
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English."
  }, {
    id: 1,
    name: 'Pizza Hut',
    locality: 'Alk Nagar',
    face: 'http://www.futomicdesigns.com/images/restaurant-interiors/top-restaurant-interiors-designer-04.jpg',
     offer: "Upto 20% off on pizzas",
     description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English."
  }, {
    id: 2,
    name: 'Barbeque Nation',
    locality: 'Chandni Chowk',
    face: 'http://anncoupons.com/images/citycompany/26389/Fine-Dining-Restaurant-Interior-Design-of-Edie-V-Prime-Seafood-Dallas.jpg',
     offer: "Upto 70% off on desserts",
     description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English."
  }, {
    id: 3,
    name: 'Baskins & Robin',
    locality: 'Hazuz Khaz',
    face: 'https://s-media-cache-ak0.pinimg.com/originals/02/7f/90/027f90f0cdccff01ee05f5ebad67cd25.jpg',
     offer: "Upto 70% off on desserts",
     description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English."
  }, {
    id: 4,
    name: 'Dumpling hood',
    locality: 'Sector 20',
    face: 'http://kolkatainterior.in/images/Restaurant-interior/best-restaurant-interior-designers-kolkata.jpg',
     offer: "Upto 70% off on desserts",
     description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English."
  }];

  return {
    all: function() {
      return stores;
    }, 
    get: function(storeId) {
      for (var i = 0; i < stores.length; i++) {
        if (stores[i].id === parseInt(storeId)) {
          return stores[i];
        }
      }
      return null;
    }
  };

})

.factory('Offers', function() {
  var offers = [{
    id: 0,
    store_id: 0,
    title: "Get 20 reward points on lunch buffet"
  }, {
    id: 1,
    store_id: 0,
    title: "Get 50 reward points on dinner buffet"
  }];

  return{
    get: function(storeId) {
      var offs = [];
      for (var i = 0; i < offers.length; i++) {
        if (offers[i].store_id === parseInt(storeId)) {
          offs[i] = offers[i];
        }
      }
      return offs;
    }, 
    getOne: function(id) {
      for (var i = 0; i < offers.length; i++) {
        if (offers[i].id === parseInt(id)) {
          return offers[i];
        }
      }
      return null;
    }
  };
})

.factory('Orders', function() {
  var orders = [
    {
      "id": "1",
      "title": "Get 50% discount",
      "store_name": "Paradise",
      "status":"EXPIRED",
      "statuscode":"3"
    },{
      "id": "2",
      "title": "Get 50% discount",
      "store_name": "Paradise",
      "status": "USED",
      "statuscode":"1"
    },{
      "id": "3",
      "title": "Get 50% discount",
      "store_name": "Paradise",
      "status":"AVAILABLE",
      "statuscode":"2"
    }
  ];

  return {
    all: function() {
      return orders;
    }
  }
})

.factory('Bills', function(){
  var bills =  [
    {
      "id": "1",
      "name": "Paradise",
      "amount":"1200",
      "image": "https://c1.staticflickr.com/3/2465/3884960004_6524c4b2c6.jpg",
      "status":"REJECTED",
      "statuscode":"3"
    },{
      "id": "2",
      "name": "Paradise",
      "amount":"500",
       "image": "http://i.dailymail.co.uk/i/pix/2009/09/11/article-1212583-06601FEE000005DC-940_233x536.jpg",
      "status":"APPROVED",
      "statuscode":"1"
    },{
      "id": "3",
      "name": "Paradise",
      "amount":"700",
       "image": "http://christinesreviews.com/reviews/wp-content/uploads/2011/05/naivedyam-730x1024.jpg",
      "status":"PENDING",
      "statuscode":"2"
    },{
      "id": "4",
      "name": "Paradise",
      "amount":"300",
       "image": "https://c1.staticflickr.com/3/2465/3884960004_6524c4b2c6.jpg",
      "status":"APPROVED",
      "statuscode":"1"
    },{
      "id": "5",
      "name": "Paradise",
      "amount":"900",
       "image": "http://christinesreviews.com/reviews/wp-content/uploads/2011/05/naivedyam-730x1024.jpg",
      "status":"PENDING",
      "statuscode":"2"
    },{
      "id": "6",
      "name": "Paradise",
      "amount":"2000",
       "image": "http://christinesreviews.com/reviews/wp-content/uploads/2011/05/naivedyam-730x1024.jpg",
      "status":"APPROVED",
      "statuscode":"1"
    }];

    return {
      all: function(){
        return bills;
      }
    }


});
