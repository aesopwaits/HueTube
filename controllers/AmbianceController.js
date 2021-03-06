var AuthService = require("../services/AuthService");

function AmbianceController(LightService,WemoService,SpotifyService, UsersCollection){
  lightService = LightService;
  wemoService = WemoService;
  spotifyService = SpotifyService;
  usersCollection = UsersCollection;
};

AmbianceController.prototype.BuildRouting = function(app,socket){
var self = this;

app.put('/ambiance/:id', function(req, res) {
  new AuthService(usersCollection).PromptForCredentials(req,res,function(){
      wemoService.getState(function(state){
          if(state == "off"){
              wemoService.turnOnWemo(function(result){
                self.turnOnLightsAndMusic(req,res);
             });
          }else{
              self.turnOnLightsAndMusic(req,res);
          }
      });

  });

});

}

AmbianceController.prototype.turnOnLightsAndMusic = function(req,res){
    spotifyService.startAirplay(function(){
      setTimeout(function(){
        spotifyService.startSpotify(req.body.songURI,function(){
              lightService.setGroupState(req.body.state,req.params.id,req.body.hue,req.body.bri,req.body.sat,req.body.effect,function(statusCode,result){
                res.send(result);
              });
          });
      },1000);
    });
}


module.exports = AmbianceController;