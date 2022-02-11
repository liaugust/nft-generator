const fetch = require('node-fetch')
const path = require('path')
const basePath = process.cwd()
const fs = require('fs')

const AUTH = 'b7228537-9f5d-4659-95fc-cfa1323cfd0a'
const CONTRACT_ADDRESS = '0xBC856dCAFE3C43593F4277159B8A01294e83de92' // rinkeby collection contract address
// const CONTRACT_ADDRESS = '0xDFE6dD8323D0de25417cc7C9163E398fdc2e65AD' // polygon collection contract address
const MINT_TO_ADDRESS = '0x513c4E722d7F5db23A029cab4b45eF513A81c7AF'
const CHAIN = 'rinkeby'
const TIMEOUT = 1000 // Milliseconds. This a timeout for errors only. If there is an error, it will wait then try again. 5000 = 5 seconds.

if (!fs.existsSync(path.join(`${basePath}/build`, '/minted'))) {
	fs.mkdirSync(path.join(`${basePath}/build`, 'minted'))
}

async function main() {
	const ipfsMetas = JSON.parse(
		fs.readFileSync(`${basePath}/build/ipfsMetas/_ipfsMetas.json`)
	)

	for (const meta of ipfsMetas) {
		const mintFile = `${basePath}/build/minted/${meta.custom_fields.edition}.json`

		try {
			fs.accessSync(mintFile)
			const mintedFile = fs.readFileSync(mintFile)
			if (mintedFile.length > 0) {
				const mintedMeta = JSON.parse(mintedFile)
				if (mintedMeta.mintData.response !== 'OK') throw 'not minted'
			}
			console.log(`${meta.name} already minted`)
		} catch (err) {
			try {
				let mintData = await fetchWithRetry(meta)
				const combinedData = {
					metaData: meta,
					mintData: mintData,
				}
				writeMintData(meta.custom_fields.edition, combinedData)
				console.log(`Minted: ${meta.name}!`)
			} catch (err) {
				console.log(`Catch: ${err}`)
			}
		}
	}
}

main()

function timer(ms) {
	return new Promise(res => setTimeout(res, ms))
}

async function fetchWithRetry(meta) {
	await timer(TIMEOUT)
	return new Promise(resolve => {
		const fetch_retry = _meta => {
			let url = 'https://api.nftport.xyz/v0/mints/customizable'

			const mintInfo = {
				chain: CHAIN,
				contract_address: CONTRACT_ADDRESS,
				metadata_uri: _meta.metadata_uri,
				mint_to_address: MINT_TO_ADDRESS,
				token_id: _meta.custom_fields.edition,
			}

			let options = {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: AUTH,
				},
				body: JSON.stringify(mintInfo),
			}

			return fetch(url, options)
				.then(async res => {
					const status = res.status

					if (status === 200) {
						return res.json()
					} else {
						console.error(`ERROR STATUS: ${status}`)
						console.log('Retrying')
						await timer(TIMEOUT)
						fetch_retry(_meta)
					}
				})
				.then(async json => {
					if (json.response === 'OK') {
						return resolve(json)
					} else {
						console.error(`NOK: ${json.error}`)
						console.log('Retrying')
						await timer(TIMEOUT)
						fetch_retry(_meta)
					}
				})
				.catch(async error => {
					console.error(`CATCH ERROR: ${error}`)
					console.log('Retrying')
					await timer(TIMEOUT)
					fetch_retry(_meta)
				})
		}
		return fetch_retry(meta)
	})
}

const writeMintData = (_edition, _data) => {
	fs.writeFileSync(
		`${basePath}/build/minted/${_edition}.json`,
		JSON.stringify(_data, null, 2)
	)
}
