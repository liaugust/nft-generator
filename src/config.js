// General metadata for Ethereum
const namePrefix = 'Liaugust'
const description = 'Liaugust description'
const baseUri = 'ipfs://NewUriToReplace'

// If you have selected Solana then the collection starts from 0 automatically
const layerConfigurations = [
	{
		growEditionSizeTo: 5,
		layersOrder: [
			{ name: 'Background' },
			{ name: 'Eyeball' },
			{ name: 'Eye color' },
			{ name: 'Iris' },
			{ name: 'Shine' },
			{ name: 'Bottom lid' },
			{ name: 'Top lid' },
		],
	},
]

const shuffleLayerConfigurations = false

const debugLogs = false

const format = {
	width: 512,
	height: 512,
	smoothing: false,
}

const gif = {
	export: false,
	repeat: 0,
	quality: 100,
	delay: 500,
}

const text = {
	only: false,
	color: '#ffffff',
	size: 20,
	xGap: 40,
	yGap: 40,
	align: 'left',
	baseline: 'top',
	weight: 'regular',
	family: 'Courier',
	spacer: ' => ',
}

const background = {
	generate: true,
	brightness: '80%',
	static: false,
	default: '#000000',
}

const extraMetadata = {
	external_url: 'https://liaugust.com', // Replace with your website or remove this line if you do not have one.
}

const rarityDelimiter = '#'

const uniqueDnaTorrance = 10000

const preview_gif = {
	numberOfImages: 5,
	order: 'ASC', // ASC, DESC, MIXED
	repeat: 0,
	quality: 100,
	delay: 500,
	imageName: 'preview.gif',
}

module.exports = {
	format,
	baseUri,
	description,
	background,
	uniqueDnaTorrance,
	layerConfigurations,
	rarityDelimiter,
	shuffleLayerConfigurations,
	debugLogs,
	extraMetadata,
	text,
	namePrefix,
	gif,
	preview_gif,
}
