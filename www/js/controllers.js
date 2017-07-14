angular.module('starter.controllers', [])

.controller('LoginCtrl', function($scope, $state, $ionicLoading, $http, $ionicPlatform, $ionicPopup){

  var user_promo_code;
  var promo_points;

  $ionicPlatform.registerBackButtonAction(function () {
    navigator.app.exitApp();
  }, 100);

  $scope.authorization = {
    token : '',
    phone: '',
    promo: ''
  };

  showLoader($ionicLoading);
  var constantsRef = firebase.database().ref('constants');
  constantsRef.once("value").then(function(snapshot){
    promo_points = snapshot.val().promo_points;
    hideLoader($ionicLoading);
  });
   
  $scope.signIn = function(form) {
    if(form.$valid) {
      // user_promo_code = user.displayName.split(' ').slice(0)[0] + randomToken(4);
      var ref = firebase.database().ref('users/' + window.localStorage.getItem("uid"));
      showLoader($ionicLoading);
      $scope.promoError = false;
      var userPoints = 0;

       var register = function() {
          ref.update({
            phone: $scope.authorization.phone,
            points: promo_points
          }).then(function(){
            var token = randomToken(4)
            $http({
              method: 'GET',
              url: 'http://103.16.101.52:8080/bulksms/bulksms?username=ints-robapp&password=rob12345&type=0&dlr=1&destination=91' + $scope.authorization.phone + '&source=ROBAPP&message=' + token
            });
            window.localStorage.setItem('verification_code', token);
            window.localStorage.setItem('phone', $scope.authorization.phone);
          }).then(function(){
            hideLoader($ionicLoading);
            $state.go('confirm');
          });
      }

      if($scope.authorization.promo != "") {
        var promoRef = firebase.database().ref('users');
        promoRef.orderByChild("code").equalTo($scope.authorization.promo).once('value').then(function(snapshot){
          if(snapshot.val() == null) {
            $scope.promoError = true;
            hideLoader($ionicLoading);
          } else {
             snapshot.forEach(function(childSnapshot) {
               childSnapshot.ref.update({
                 points: childSnapshot.val().points + promo_points
               }).then(register());
            });
             hideLoader($ionicLoading);
          }
        }, function(error) {
          hideLoader($ionicLoading);
           var alertPopup = $ionicPopup.alert({
            title: 'Error',
            template: error
          });
        });
      } else {
        register();
      }
    } else {
      $scope.phoneError = true
    }
  }; 
})

.controller('RegisterCtrl', function($scope, $ionicPlatform, $cordovaOauth, $ionicPopup, $ionicLoading, $ionicHistory, $state, $rootScope) {
  if(window.localStorage.getItem('access_token') != null && window.localStorage.getItem('state') === "logged-in"){
    $rootScope.hideTabs = '';
    $ionicHistory.nextViewOptions({
      disableBack: true,
      historyRoot: true
    });
    //$ionicHistory.clearCache();
    $state.go("tab.dash");
  } else if(window.localStorage.getItem('state') === "created"){
     $ionicHistory.nextViewOptions({
      disableBack: true,
      historyRoot: true
    });
    //$ionicHistory.clearCache();
    $state.go("login");
  }

  $ionicPlatform.registerBackButtonAction(function () {
    navigator.app.exitApp();
  }, 100);

  // var provider = new firebase.auth.FacebookAuthProvider();
  var userExists = false;
  var auth = firebase.auth();
  var user_promo_code;

  var registerNewUser = function(access_token) {
     var credential = firebase.auth.FacebookAuthProvider.credential(access_token);
      auth.signInWithCredential(credential).then(function(user) {
          user_promo_code = user.displayName.split(' ').slice(0)[0] + randomToken(4);
          firebase.database().ref('users/' + user.uid).set({
            points: 0,
            code: user_promo_code,
            phone: null
          }).then(function() {
            $ionicLoading.hide();
            window.localStorage.setItem("access_token", access_token);
            window.localStorage.setItem("state", "created");
            window.localStorage.setItem("photoUrl", user.photoURL);
            window.localStorage.setItem("email", user.email);
            window.localStorage.setItem("displayName", user.displayName);
            window.localStorage.setItem("points", 0);
            window.localStorage.setItem("promo_code", user_promo_code);
            window.localStorage.setItem("uid", user.uid);
            
            $rootScope.hideTabs = ''
            $ionicHistory.nextViewOptions({
              disableBack: true,
              historyRoot: true
            });
            //$ionicHistory.clearCache();
            $state.go("login");
          });
      });
  }

  var loginUser = function(access_token){
     var credential = firebase.auth.FacebookAuthProvider.credential(access_token)
     auth.signInWithCredential(credential).then(function(user) {
          firebase.database().ref('/users/' + user.uid).once('value').then(function(snapshot) {
            if(snapshot.val() == null || snapshot.val().phone == null ) {
              
              //USER HAS NOT REGISTERED PHONE
              $ionicLoading.hide();
              window.localStorage.setItem("access_token", access_token);
              window.localStorage.setItem("state", "created");
              window.localStorage.setItem("photoUrl", user.photoURL);
              window.localStorage.setItem("email", user.email);
              window.localStorage.setItem("displayName", user.displayName);
              window.localStorage.setItem("points", 0);
              window.localStorage.setItem("promo_code", user_promo_code);
              window.localStorage.setItem("uid", user.uid);
              
              $rootScope.hideTabs = ''
              $ionicHistory.nextViewOptions({
                disableBack: true,
                historyRoot: true
              });
              //$ionicHistory.clearCache();
              $state.go("login");
            } 
            else{

              //USER HAS REGISTERED PHONE 
              $ionicLoading.hide();

              window.localStorage.setItem("access_token", access_token);
              window.localStorage.setItem("state", "logged-in");
              window.localStorage.setItem("photoUrl", user.photoURL);
              window.localStorage.setItem("email", user.email);
              window.localStorage.setItem("displayName", user.displayName);
              window.localStorage.setItem("promo_code", snapshot.val().code);
              window.localStorage.setItem("points", snapshot.val().points);
              window.localStorage.setItem("uid", user.uid);
              window.localStorage.setItem("phone", snapshot.val().phone);

              $rootScope.hideTabs = ''
              $ionicHistory.nextViewOptions({
                disableBack: true,
                historyRoot: true
              });
              //$ionicHistory.clearCache();
              $state.go("tab.dash");
            }
          });
      }).catch(function(error){
        $ionicLoading.hide();
        var alertPopup = $ionicPopup.alert({
            title: 'Error',
            template: error
          });
      });
  }

  // loginUser('EAAToTvP6ndkBADv3iIWj4NXflZBCsqh1ZCgde5aRqTERSZCONFhcax3vjZClaV0ffpKGSIFRVjC7iT7dXZArICzYGx45leWnyqjIsLy3pDhXZBm5WLtaoWG98jtuzDvMQ742vGinlX2oZBz4gDfRFdKwHCA3aIFxP3HcqZCasKHPdrY7IWlUbyZBm1J3nX47hJBTF4r0WLuCc2LQiRwiYKp7krNku9U99yeIP8Rx831W5PQZDZD');

  $scope.login = function(){
      showLoader($ionicLoading);
      $cordovaOauth.facebook("1381325705223641", ["email", "public_profile"]).then(function(result) {
            FB.api('/me', { access_token: result.access_token ,locale: 'en_US', fields: 'name, email' },
              function(response) {
                var userEmail = response.email;
                var name = response.name;
                auth.fetchProvidersForEmail(userEmail).then(function(providers) {
                  if(providers.length > 0) {
                    loginUser(result.access_token);
                  } else {
                     registerNewUser(result.access_token);
                  }
                }, function(error){
                    var alertPopup = $ionicPopup.alert({
                      title: 'Error',
                      template: 'There was an error!'
                    }); 
                });
              }
            );
      }, function(error) {
        $ionicLoading.hide();
        var alertPopup = $ionicPopup.alert({
          title: 'Error',
          template: 'There was an error!'
        }); 
    })
  }
})

.controller('ConfirmCtrl', function($scope, $state, $ionicHistory, $rootScope){
  $scope.tokenError = false
  $scope.authorization = {
    token : '',
  }; 
  $scope.confirm = function(form) {
    if(window.localStorage.getItem('verification_code') === $scope.authorization.token) {
       window.localStorage.setItem('state', 'logged-in');
       $ionicHistory.nextViewOptions({
        disableBack: true,
        historyRoot: true
       });
       // $ionicHistory.clearCache();
       $rootScope.hideTabs = ''
       $state.go('tab.dash');
    } else {
      $scope.tokenError = true
    }
  }
})

.controller('DashCtrl', function($scope,$cordovaGeolocation, $ionicLoading,  $state, $ionicViewService, $ionicPlatform, $ionicHistory, $ionicSideMenuDelegate, $rootScope, $http, $ionicModal) {

      $rootScope.hideTabs = '';

      $scope.toggleLeft = function() {
        $ionicSideMenuDelegate.toggleLeft();
      };

      $ionicLoading.show({
          template: '<ion-spinner icon="ripple"></ion-spinner>',
      });

      $scope.var= 1;
      $scope.clicked = function(num) {
        $scope.var = num;
      }

      $scope.$on("$ionicSlides.sliderInitialized", function(event, data){
      // data.slider is the instance of Swiper
        $scope.slider = data.slider;
      });

      $scope.$on("$ionicSlides.slideChangeStart", function(event, data){
        // console.log('Slide change is beginning');
      });

      $scope.$on("$ionicSlides.slideChangeEnd", function(event, data){
        // note: the indexes are 0-based
        $scope.activeIndex = data.slider.activeIndex;
        $scope.previousIndex = data.slider.previousIndex;
      });

      $scope.error ="";

      $scope.photoUrl = window.localStorage.getItem("photoUrl");
      $scope.displayName = window.localStorage.getItem("displayName");
      $scope.displayCode = window.localStorage.getItem("promo_code");

      if(window.localStorage.getItem('locality') === null){
        window.localStorage.setItem('locality', 'Habsiguda')
      }

      $scope.locality = window.localStorage.getItem('locality');

      $scope.localities = [];

      var bannerRef = firebase.database().ref('banner');
      bannerRef.on("value", function(snapshot) {
        $scope.banners = snapshot.val();
      }, function (error) {
        $scope.error = "Could not load slides."
      });

      var ref = firebase.database().ref('stores').orderByChild("locality").equalTo($scope.locality);
      ref.on("value", function(snapshot) {
        $scope.stores = snapshot.val();
        $ionicLoading.hide();
        // console.log(snapshot.val());
      }, function (error) {
        $ionicLoading.hide();
        $scope.error = "Could not load stores."
      });

      var ref = firebase.database().ref('localities');
      ref.on("value", function(snapshot) {
        $scope.localities = snapshot.val();
        $ionicLoading.hide();
        console.log(snapshot.val());
      }, function (error) {
        $ionicLoading.hide();
        $scope.error = "Could not load stores."
      });

      var trendingRef = firebase.database().ref('stores').orderByChild('trending').equalTo(true);
      trendingRef.on("value", function(snapshot){
        $scope.trending = snapshot.val();
        //console.log(snapshot.val());
      }, function(err){
        $scope.error = "Could not load stores."
      });

      $ionicModal.fromTemplateUrl('templates/localities-modal.html', {
        scope: $scope
      }).then(function(modal) {
        $scope.modal = modal;
      });

      $scope.showLocalities = function(){
        $scope.modal.show();
      }

      $scope.selectLocation = function(item){
        window.localStorage.setItem('locality', item.name);
        $scope.locality = window.localStorage.getItem('locality');
        $scope.modal.hide();

        showLoader($ionicLoading);
        var ref = firebase.database().ref('stores').orderByChild("locality").equalTo($scope.locality);
        ref.on("value", function(snapshot) {
          $scope.stores = snapshot.val();
          $ionicLoading.hide();
          // console.log(snapshot.val());
        }, function (error) {
          $ionicLoading.hide();
          $scope.error = "Could not load stores."
        });
      }
})

.controller('StoreDetailCtrl', function($scope, $stateParams, $window, $ionicModal, Stores, Offers, $rootScope, $firebaseArray, $ionicLoading, $ionicPlatform){

  showLoader($ionicLoading);
  $scope.myGoBack = function() {
      $window.history.go(-1);
  };

  $ionicPlatform.registerBackButtonAction(function () {
    $window.history.go(-1);
  }, 100);

  $ionicModal.fromTemplateUrl('templates/deal-popover.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.offers = [];

  var ref = firebase.database().ref('stores/' + $stateParams.storeId);
  ref.on('value', function(snapshot) {
    $scope.store = snapshot.val();

    var offersRef = firebase.database().ref('offers');
    var store_id = $stateParams.storeId;
    offersRef.on("value", function(data){
      data.forEach(function(child){
        $scope.offers.push(child.val());
      });
      hideLoader($ionicLoading);
    }, function(error) {
      console.log(error);
    });
  }, function (error) {
     $scope.error = "Could not load stores."
  });

  $scope.openModal = function(offer) {
    $scope.offer = offer
    $scope.modal.show();
  };
})

.controller('RewardsCtrl', function($scope, Rewards, $ionicLoading, $rootScope, $ionicPopup, $http) {

  var phone = window.localStorage.getItem("phone");
  var user_id = window.localStorage.getItem("uid");
  $scope.paytm_cashback = 2;

  $ionicLoading.show({
      template: '<ion-spinner icon="ripple"></ion-spinner>',
  })

  var constantsRef = firebase.database().ref('constants');
  constantsRef.on("value", function(snapshot){
    $scope.paytm_cashback = snapshot.val().paytm
  });

   var pointsRef = firebase.database().ref('users/' + user_id);
    pointsRef.on("value", function(snapshot) {
     $scope.points = snapshot.val().points;

     var ref = firebase.database().ref('rewards');
      ref.on("value", function(snapshot) {
        $scope.rewards = snapshot.val();
        $ionicLoading.hide();
      }, function (error) {
        $ionicLoading.hide();
        $scope.error = "Could not load rewards."
      });

  }, function (error) {
     $scope.points = window.localStorage.getItem('points');
  });

  $scope.cashback = {
    amount: null,
  }

  $scope.transfer = {
    amount:  null,
    phone: ""
  }

  $scope.transferRewards = function(){
    var popup = $ionicPopup.show({
    template: '<input type="tel" ng-model="transfer.amount" placeholder="Enter amount"><input type="tel" ng-model="transfer.phone" placeholder="Enter phone">',
    title: 'Transfer rewards' ,
    subTitle: '',
    scope: $scope,
    buttons: [
      { text: 'Cancel' },
        {
          text: '<b>Save</b>',
          type: 'button-positive',
          onTap: function(e) {
            if (!$scope.transfer.amount || !$scope.transfer.phone) {
              //don't allow the user to close unless he enters wifi password
              e.preventDefault();
            } else if($scope.points < 100){
              var alertPopup = $ionicPopup.alert({
                title: 'Error',
                template: 'You should have minimum 100 points to use this feature.'
              }); 
            } else if($scope.transfer.amount > $scope.points){
              var alertPopup = $ionicPopup.alert({
                title: 'Error',
                template: 'You do not have enough points'
              }); 
            } else {
              showLoader($ionicLoading);
              // var transferRef = firebase.database().ref('users/' + user_id)
              var promoRef = firebase.database().ref('users');
              var userRef = firebase.database().ref('users/'+ user_id);
              promoRef.orderByChild("phone").equalTo($scope.transfer.phone).once('value').then(function(snapshot){
                if(snapshot.val() == null) {
                   var alertPopup = $ionicPopup.alert({
                      title: 'Error',
                      template: 'User with this number does not exist.'
                  });
                  hideLoader($ionicLoading);
                } else {
                  snapshot.forEach(function(childSnapshot) {
                    childSnapshot.ref.update({
                      points: Number(childSnapshot.val().points) + Number($scope.transfer.amount)
                    }).then(function(){
                      userRef.update({
                        points: $scope.points - $scope.transfer.amount
                      })
                      hideLoader($ionicLoading);
                    });
                  });
                }
              }, function(error) {
                hideLoader($ionicLoading);
                var alertPopup = $ionicPopup.alert({
                  title: 'Error',
                  template: "Something went wrong"
                });
              });
            }
          }
        }
      ]
    });
  }

  $scope.getCashback = function(){
    var popup = $ionicPopup.show({
    template: '<input type="tel" ng-model="cashback.amount" placeholder="Enter amount">',
    title: 'Get ' + $scope.paytm_cashback + '% cashback on Paytm' ,
    subTitle: 'A recharge worth '+ $scope.paytm_cashback + '% of reward points value will be done and a confirmation message will be sent to you',
    scope: $scope,
    buttons: [
      { text: 'Cancel' },
        {
          text: '<b>Save</b>',
          type: 'button-positive',
          onTap: function(e) {
            if (!$scope.cashback.amount) {
              //don't allow the user to close unless he enters wifi password
              e.preventDefault();
            } else if($scope.points < 100){
              var alertPopup = $ionicPopup.alert({
                title: 'Error',
                template: 'You should have minimum 100 points to use this feature.'
              }); 
            }else if($scope.cashback.amount > $scope.points){
              var alertPopup = $ionicPopup.alert({
                title: 'Error',
                template: 'You do not have enough points'
              }); 
            } else {
              showLoader($ionicLoading);
              var ref = firebase.database().ref('cashbacks');
              var userRef = firebase.database().ref('users/'+ user_id);
              var updatedPoints = $scope.points - $scope.cashback.amount;
              ref.push({
                user_id: user_id,
                amount: Number($scope.cashback.amount) / $scope.paytm_cashback,
                phone: window.localStorage.getItem('phone'),
                state: 'PENDING'
              }).then(function(){
                userRef.update({
                  points: updatedPoints
                }).then(function(){
                  $ionicLoading.hide();
                  $scope.points = updatedPoints;
                   window.localStorage.setItem('points', updatedPoints);
                })
              }) 
            }
          }
        }
      ]
    });
  }
})

.controller('RewardDetailCtrl', function($scope, $stateParams, $ionicLoading, $ionicPopup, $ionicHistory, $state) {

  $scope.points = window.localStorage.getItem('points');
  var phone = window.localStorage.getItem("phone");
  var user_id = window.localStorage.getItem('uid');
  var code = randomString(6);
  $ionicLoading.show({
      template: '<ion-spinner icon="ripple"></ion-spinner>',
  })

  var ref = firebase.database().ref('rewards/' + $stateParams.rewardId);
  ref.on('value', function(snapshot) {
    $scope.reward = snapshot.val();
    $ionicLoading.hide();
  }, function (error) {
     $scope.error = "Could not load reward."
  });

  $scope.getReward = function() {
    if($scope.reward.points > $scope.points){
      var alertPopup = $ionicPopup.alert({
        title: 'Error',
        template: 'You need more reward points to get this reward. Visit more partner stores.'
      }); 
    } else {
       showLoader($ionicLoading);
       var userRef = firebase.database().ref('users/'+ user_id);
       var newPoints = $scope.points - $scope.reward.points;
       userRef.update({
         points: newPoints
       }).then(function(){
         var orderRef = firebase.database().ref('orders');
         orderRef.push({
           user_id: user_id,
           reward_id:  $stateParams.rewardId,
           name: $scope.reward.name,
           code: code,
           state: "PENDING",
           id: orderRef.push().key
         }).then(function(){
          $ionicLoading.hide();
          window.localStorage.setItem('points',newPoints);
          $ionicHistory.nextViewOptions({
            disableBack: true
          });
          $state.go('tab.rewards');
        })
       })
    }
  }
})

.controller('BillsCtrl', function($scope, $ionicLoading, $stateParams) {
  showLoader($ionicLoading);
  $scope.bills = [];
  var user_id =  window.localStorage.getItem('uid');
  var billsRef = firebase.database().ref('bills');
  billsRef.orderByChild("user_id").equalTo(user_id).on("value", function(data){
    data.forEach(function(child) {
      $scope.bills.push(child.val());
    });
    hideLoader($ionicLoading);
  }, function(error) {
    console.log(error);
  });
})

.controller('OfferDetailCtrl', function($scope, $stateParams, Offers, $rootScope, $ionicLoading){
  $scope.store = Offers.getOne($stateParams.storeId);
})

.controller('UploadCtrl', function($scope, $stateParams, $cordovaCamera, Offers, $rootScope, $ionicLoading, $ionicPopup, $timeout, $state, $ionicHistory) {
  $scope.bill = {
    face: null,
    amount: null
  };

  $scope.offer = {};

  showLoader($ionicLoading);
  var offerRef = firebase.database().ref('offers/' + $stateParams.offerId)
  offerRef.on('value', function(snapshot){
    $scope.offer = snapshot.val();
    //console.log(snapshot.val());
    hideLoader($ionicLoading);
  })

  $scope.takeImage = function() {
      var options = {
          quality: 75,
          destinationType: Camera.DestinationType.DATA_URL,
          sourceType: Camera.PictureSourceType.CAMERA,
          allowEdit: false,
          encodingType: Camera.EncodingType.JPEG,
          targetWidth: 600,
          targetHeight: 800,
          popoverOptions: CameraPopoverOptions,
          saveToPhotoAlbum: false,
          correctOrientation: true
      };
       
      $cordovaCamera.getPicture(options).then(function(imageData) {
          $scope.srcImage = "data:image/jpeg;base64," + imageData;

          $ionicLoading.show({
              template: '<ion-spinner icon="ripple"></ion-spinner>',
          });

          var name = randomString(8) + ".jpg";
          var ref = firebase.storage().ref().child(name);;
          ref.putString($scope.srcImage ,'data_url').then(function(snapshot) {
              snapshot.ref.getDownloadURL().then(function(url) {
                  $scope.bill.face = url;
                  $ionicLoading.hide();
                });
          });
      }, function(err) {
          console.log(err);
      });
  };

  $scope.chooseImage = function () {
      var options = {
        quality: 75,
        destinationType: Camera.DestinationType.DATA_URL,
        sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
        allowEdit: false,
        encodingType: Camera.EncodingType.JPEG,
        targetWidth: 600,
        targetHeight: 800,
        popoverOptions: CameraPopoverOptions,
        saveToPhotoAlbum: false
    };

        $cordovaCamera.getPicture(options).then(function (imageData) {
            $scope.srcImage = "data:image/jpeg;base64," + imageData;

            $ionicLoading.show({
                template: '<ion-spinner icon="ripple"></ion-spinner>',
            });

            var name = randomString(8) + ".jpg";

            var ref = firebase.storage().ref().child(name);;
            var message = 'This is my message.';
            ref.putString($scope.srcImage ,'data_url').then(function(snapshot) {
                snapshot.ref.getDownloadURL().then(function(url) {
                  $scope.bill.face = url;
                  $ionicLoading.hide();
                });
            });
        }, function (err) {
            // An error occured. Show a message to the user
        });
    };

      $scope.submit = function(form) {
        if(form.$valid) {

           var sendBill = function(){
            showLoader($ionicLoading);
            firebase.database().ref('bills').push({
              offer_id: $stateParams.offerId,
              offer_title: $scope.offer.title,
              offer_cashback: $scope.offer.cashback,
              user_id: window.localStorage.getItem('uid'),
              status: "PENDING",
              amount: $scope.bill.amount,
              face: $scope.bill.face,
              phone: window.localStorage.getItem("phone"),
              store_id: $scope.offer.store_id,
              createdAt: firebase.database.ServerValue.TIMESTAMP
            }).then(function(){
              $ionicLoading.hide();
              var alertPopup = $ionicPopup.alert({
                title: 'Bill upload successfull',
                template: 'You will recieved reward points when bill is approved.'
              });
              alertPopup.then(function(res) {
                $ionicHistory.nextViewOptions({
                  disableBack: true,
                  historyRoot: true
                });
                 $rootScope.hideTabs = ''
                 $state.go('tab.dash');
              });
            }); 
          }

          if($scope.bill.amount == null){
            $scope.amountError = true;
          } else if($scope.bill.face == null){
            $scope.faceError = true;
          } else {
            sendBill();
          }
        } else {
          console.log("clicked");
        }
      }
})

.controller('OrderCtrl', function($scope, $ionicLoading, $stateParams) {
  $ionicLoading.show({
      template: '<ion-spinner icon="ripple"></ion-spinner>',
  })

  var ref = firebase.database().ref('orders').orderByChild('id').equalTo($stateParams.orderId);
  ref.on('value', function(snapshot) {
    snapshot.forEach(function(childSnapshot) {
      $scope.order = childSnapshot.val();
      if($scope.order.state==="PENDING"){
        $scope.pending = true
      } else if ($scope.order.state==="USED") {
        $scope.used = true
      } else if($scope.order.state==="EXPIRED") {
        $scope.expired = true
      }

      $scope.getCode = function(){
        $ionicLoading.show({
            template: '<ion-spinner icon="ripple"></ion-spinner>',
        })
        var updaterRef =  firebase.database().ref('orders/'+ childSnapshot.key);
        updaterRef.update({
          state: "USED"
        }).then(function(){
          $scope.state = "USED";
          $ionicLoading.hide();
        })
      }
      return true;
    });
    $ionicLoading.hide();
  }, function (error) {
     $scope.error = "Could not load order."
  });
})

.controller('AccountCtrl', function($scope, $ionicLoading,  $cordovaSocialSharing) {
  $scope.orders = [];
  $scope.code = window.localStorage.getItem("promo_code");
  $scope.var= 1;
    $scope.clicked = function(num) {
      $scope.var = num;
  };
  showLoader($ionicLoading);
   var user_id =  window.localStorage.getItem('uid');
    var ordersRef = firebase.database().ref('orders');
    ordersRef.orderByChild("user_id").equalTo(user_id).on("value", function(data){
      data.forEach(function(child) {
        $scope.orders.push(child.val());
      });
      hideLoader($ionicLoading);
    }, function(error) {
      console.log(error);
    });

    $scope.share = function(){
      var message = "This is an awesome app!! ROB app. Now all your visits to your favorite places get you rewards. It's amazing. \nUse my promo code: " + $scope.code + "\nGet it on:\n";
      var subject = "ROB App";
      var link = "https://play.google.com/store/apps/details?id=com.rewardsonbill.rob"
      $cordovaSocialSharing
        .share(message, subject, null, link) // Share via native share sheet
        .then(function(result) {
          // Success!
        }, function(err) {
          // An error occured. Show a message to the user
        });
    }
});


function showLoader(load) {
  load.show({
      template: '<ion-spinner icon="ripple"></ion-spinner>',
  })
}

function hideLoader(load) {
  load.hide();
}

function initFire(){
  var config = {
    apiKey: "AIzaSyD4EYOdGJiejHyeu7a5Bxuh6Gfa4cLssVA",
    authDomain: "rewards-on-bills.firebaseapp.com",
    databaseURL: "https://rewards-on-bills.firebaseio.com",
    storageBucket: "rewards-on-bills.appspot.com",
    messagingSenderId: "250385009538"
  };
  firebase.initializeApp(config);
}

function randomString(length) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for(var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

function randomToken(length) {
  var text = "";
    var possible = "0123456789";
    for(var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}