function Noise(ctx, type){
	var node = ctx.createBufferSource();
	node.loop = true;

	var buffer = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
	generators[type](buffer);
	node.buffer = buffer;

	this.start = function(){
		console.log("noise started");
		console.log(buffer.getChannelData(0));
		node.start();
	}
	
	this.stop = function(){
		node.stop();
	}
	
	this.connect = function(target){
		console.log("noise connected");
		node.connect(target);
	}
	
	this.disconnect = function(){
		//nyi
	}
}

module.exports = Noise;

var generators = {
	white: function(buffer){
		for(let i = 0; i < buffer.length; i++){
			buffer.getChannelData(0)[i] = 2*Math.random() - 1;
		}
	},
	pink: function(buffer){
		var b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0, white;

		for (let i = 0; i < buffer.length; i++) {
			white = Math.random() * 2 - 1;

			b0 = 0.99886 * b0 + white * 0.0555179;
			b1 = 0.99332 * b1 + white * 0.0750759;
			b2 = 0.96900 * b2 + white * 0.1538520;
			b3 = 0.86650 * b3 + white * 0.3104856;
			b4 = 0.55000 * b4 + white * 0.5329522;
			b5 = -0.7616 * b5 - white * 0.0168980;

			buffer.getChannelData(0)[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
			buffer.getChannelData(0)[i] *= 0.11;
			b6 = white * 0.115926;
		}
	},
	brown: function(buffer){
		var last = 0;
		for(let i = 0; i < buffer.length; i++){
			last = buffer.getChannelData(0)[i] = (last + Math.random()*0.02)/1.02;
			buffer.getChannelData(0)[i] *= 3.5;
		}
	}
}