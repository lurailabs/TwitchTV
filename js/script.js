/**
 * Created by lurai on 18/02/2016.
 */

var Channel = function(name, picture, game, status) {

    var url         = 'http://www.twitch.tv/' + name;
    this.exists     = true;
    this.streaming  = false;

    this.render = function() {

        var description = this.streaming ? game + ' ' + status : this.exists ? 'offline' : 'account closed';

        var channelStr   = '<li class="channel">';
        channelStr      += '<a href="' + url + '" target="_blank">';
        channelStr      += '<h3>' + name + '</h3>';
        channelStr      += picture ?
                            '<img class="profilePic" src="' + picture + '" />' :
                            '<img class="profilePic"  />';
        channelStr      += '<p>' + description + '</p>';
        channelStr      += this.streaming ? '<div class="status online"></div>' : '<div class="status offline"></div>';
        channelStr      += '</a>';
        channelStr      += '</li>';

        if (this.streaming) {
            $('#channels').prepend(channelStr);
        }
        else $('#channels').append(channelStr);
    }
};

/**************************************************/

var getData = function(name) {

    var channel = null;

    var getChannel = function() {
        $.getJSON('https://api.twitch.tv/kraken/channels/' + name + '?callback=?',
            function(data) {
                channel = new Channel(name, data.logo, data.game, data.status);
                if (data.status === 422) {
                    channel.exists = false;
                    channel.render();
                } else getStream(channel);
            }
        );
    }; // getChannel

    var getStream = function(channel) {
        $.getJSON('https://api.twitch.tv/kraken/streams/' + name + '?callback=?',
            function(data) {
                if (data.stream) channel.streaming = true;
                channel.render();
            }
        );
    }; //getStream

    getChannel(name);

}; // getData


/**************************************************/

$('document').ready( function() {

    var channels = ['brunofin','freecodecamp', 'OgamingSC2', 'storbeck', 'terakilobyte', 'ethieenn',
                    'habathcx', 'RobotCaleb','thomasballinger','noobs2ninjas','beohoff'];

    for (var i=0; i<channels.length; i++) {
        getData(channels[i]);
    }
});
