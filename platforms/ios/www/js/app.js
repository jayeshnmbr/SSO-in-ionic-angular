
// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var ssoWal = angular.module('starter', ['ionic', 'ui.router','ngCordova', 'ngCordovaOauth']);

ssoWal.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})
ssoWal.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

    .state('home', {
      url: '/home',
      templateUrl: 'home.html',
      controller: 'HomeCtrl'
    })

    .state('login', {
      url: '/login',
      templateUrl: 'login.html',
      controller: 'ExampleCtrl'
    });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');

});
ssoWal.controller('ExampleCtrl', ['$rootScope','$scope', '$cordovaOauth', '$http', '$window','$ionicLoading','$state','LoginService',function($rootScope,$scope, $cordovaOauth, $http, $window, $ionicLoading,$state,LoginService){

  $rootScope.googleLogin = function(){
    $cordovaOauth.google("1083864591230-khs1mjjvhgdv5g1b41q4p25si2l28cph.apps.googleusercontent.com",
      ["https://www.googleapis.com/auth/urlshortener", "https://www.googleapis.com/auth/userinfo.email",
        "https://www.googleapis.com/auth/userinfo.profile"]).
    then(function(result){
      var accessToken;
      console.log(JSON.stringify(result));
      accessToken = JSON.stringify(result);
      console.log(result.access_token);
      console.log(typeof(result.access_token));
      $rootScope.accessToken = result.access_token;
      alert("Google sign in success.. "+" Access token received: "+result.access_token);

        $ionicLoading.show({
          template: 'Loading...'
        });

      //getting profile info of the user
      $http({method:"GET", url:"https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token="+result.access_token}).success(function(response){

        var param = {
          provider: 'google',
          google: {
            uid: response["id"],
            provider: 'google',
            first_name: response["given_name"],
            last_name: response["family_name"],
            email: response.email,
            image: response.picture
          }
        };


        LoginService.setUserInfo(param);

        $state.go("home");

      }, function(error) {
        console.log(error);
      });

    }, function(error){
      console.log(error);
    });
  }

}])

ssoWal.service('LoginService',function($window){
  /*if data is in the same scope-use the below
   var userDetails = {};
   var setUserInfo = function(userInfo){
   userDetails = userInfo;
   alert("userDetails > "+JSON.stringify(userDetails));
   }
   var getUserInfo = function(){
   alert("< userDetails in get> "+JSON.stringify(userDetails));
   return userDetails;
   }*/

  var KEY = "userDetails";
  var setUserInfo = function(userInfo){
    var userDetails = userInfo;
    $window.sessionStorage.setItem(KEY,JSON.stringify(userDetails));
    //alert("userDetails > "+JSON.stringify(userDetails));
  }
  var getUserInfo = function(){
    var userDetails = $window.sessionStorage.getItem(KEY);
    userDetails = JSON.parse(userDetails);
    //alert("< userDetails in get> "+JSON.stringify(userDetails));
    return userDetails || {};
  }
  return{
    setUserInfo:setUserInfo,
    getUserInfo:getUserInfo
  };
});

ssoWal.controller('HomeCtrl', ['$rootScope','$scope','$ionicLoading','$state','LoginService', function($rootScope,$scope,$ionicLoading,$state,LoginService){


    $ionicLoading.hide();

  var userDetails = LoginService.getUserInfo();
  //alert("google > "+JSON.stringify(userDetails["google"]));
  $scope.firstname = userDetails["google"]["first_name"];
  $scope.lastname = userDetails["google"]["last_name"];
  $scope.email = userDetails["google"]["email"];
  $scope.image = userDetails["google"]["image"];
  $scope.date = new Date();

}]);

