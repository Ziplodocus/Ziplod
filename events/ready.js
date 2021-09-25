
export const ready = {
	name: 'ready',
	how: 'once',
	execute(client) {
		console.log(`Ready! Logged in as ${client.user.tag}`);
	},
};
