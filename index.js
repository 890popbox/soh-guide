/* Usable Sysbols ◎●←↑→↓↖↗↘↙ */

const mapID = [3020];	    // MAP ID to input [ Normal de , Hard de ]

//Only boss that matters
const obtm = {
	108: {msg: 'Basic / Front Stun'},
	120: {msg: '**In**'},
	121: {msg: '**Out-In-In**'},
	122: {msg: '**In-Out-Out*'},
	123: {msg: '**Out**'},
	124: {msg: 'Front Hammer Slam (Out Safe)'},
	125: {msg: 'Spin (In Safe)'},
	126: {msg: 'Big Front Hammer Slam (Out Safe)'},
	127: {msg: 'Jump'},
	128: {msg: 'Upper cut ~Knock up'},
	129: {msg: 'Hammer Toss!'},
	131: {msg: 'UNK'},
	132: {msg: 'UNK'},
	133: {msg: '2ndary Aggro Jump > Outward Donuts'},
	134: {msg: 'Big Spin (In Safe)'},
	135: {msg: 'Puddle Inc.'},
	136: {msg: '??? UNK'},
	137: {msg: 'Outware pluse'},
	138: {msg: '??? In > Out Projectile'},
	139: {msg: 'Inward succ'},
	201: {msg: '??? UNK 30%?'},
	202: {msg: '202 Hold Block? 3 Seconds'},
	203: {msg: 'Jump over puddles'},
	204: {msg: '??? UNK?'},
};

//Export the module
module.exports = function soh_guide(d) {
	let command = d.command;
	let hooks = [],
		bossCurLocation,
		bossCurAngle,
		uid0 = 999999999n,
		sendToParty = false,
		enabled = true,
		itemhelper = true,
	   	streamenabled = false;

	//Load the map
	d.hook('S_LOAD_TOPO', 3, (event) => {
		if (event.zone === mapID[0])
		{
			command.message('Welcome to <font color="#56B4E9">Sea of Honor</font>');
			load();
		}
		else
		{
			unload();
		}
    });

	//Turn it on and off
	command.add(['soh', '!soh'], {
        $none() {
            enabled = !enabled;
			command.message('Sea of Honour '+(enabled ? 'Enabled' : 'dabled') + '.');
		},
		$default() {
			command.message('Error (typo?) in command! see README for the list of valid commands')
		},
		itemhelp() {
			itemhelper = !itemhelper;
			command.message('Item helper for safe spots '+(itemhelper ? 'Enabled' : 'dabled') + '.');
		},
		toparty(arg) {
			if(arg === "streamsoh")
			{
				streamenabled = !streamenabled;
				sendToParty = false;
				itemhelper = false;
				command.message((streamenabled ? 'Stream de Enabled' : 'Stream de dabled'));
			}
			else
			{
				streamenabled = false;
				sendToParty = !sendToParty;
				command.message((sendToParty ? 'Sea of Honour Guide - Messages will be sent to the party' : 'Nest Guide - Only you will see messages in chat'));
			}
		}
	});

	function sendMessage(msg)
	{
		if (sendToParty)
		{
			d.toServer('C_CHAT', 1, {
			channel: 21, //21 = p-notice, 1 = party, 2 = guild
			message: msg
			});
		}
		else if(streamenabled)
		{
			command.message(msg);
		}
		else
		{
			d.toClient('S_CHAT', 3, {
			channel: 21, //21 = p-notice, 1 = party
			name: 'DG-Guide',
			message: msg
			});
		}
	}

	function load()
	{
		if(!hooks.length)
		{
			hook('S_ACTION_STAGE', 9, (event) => {
				if(!enabled || event.stage != 0) return;

				if (event.templateId === 1000)
				{
					let skill = event.skill.id % 1000;
					if(obtm[skill])
					{
						sendMessage(obtm[skill].msg);
					}
				}
				else if (event.templateId === 2000)
				{
					let skill = event.skill.id % 1000;
					if(obtm[skill])
					{
						sendMessage(obtm[skill].msg);
					}
				}
				else if (event.templateId === 2200)
				{
					let skill = event.skill.id % 1000;
					if(obtm[skill])
					{
						sendMessage(obtm[skill].msg);
					}
				}
			});
		}
	}

	function unload()
	{
		if(hooks.length)
		{
			for(let h of hooks) d.unhook(h);

			hooks = []
		}
	}

	function hook()
	{
		hooks.push(d.hook(...arguments));
	}
}
