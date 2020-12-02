function fetchData() {
	return new Promise((res, rej) => {
		let requestXML = new XMLHttpRequest()
		requestXML.open('GET', 'https://restcountries.eu/rest/v2/all', true)

		requestXML.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {
				res(requestXML.responseText)
			} else if (this.readyState == 4 && this.status !== 200) {
				rej('error occurred while fetching data')
			}
		}

		requestXML.send()
	})
}

// Call countriesApi to get countries data
fetchData()
	.then(response => {
		generateHtml(JSON.parse(response))
	})
	.catch(err => console.error(err))

//Creates individual Card
function createCard(countryObj) {
	const card = createDomElement('div', 'card')
	const cardBody = createDomElement('div', 'card-body')
	const cardTitle = createDomElement('h5', 'card-title')
	if (countryObj.name.length > 15) {
		cardTitle.classList.add('short-title')
	}
	cardTitle.innerHTML = countryObj.name

	const image = createDomElement('img', 'card-img-top')
	image.src = countryObj.flag
	image.alt = countryObj.name

	const cardContents = createDomElement('div', 'card-contents')

	const capitalP = createDomElement('p', 'capital')
	capitalP.innerHTML = 'Capital:'
	const capitalPSpan = createDomElement('span')
	if (!countryObj.capital) {
		capitalPSpan.innerHTML = 'NA'
	} else {
		capitalPSpan.innerHTML = countryObj.capital
	}
	capitalP.append(capitalPSpan)

	const countryCodesP = createDomElement('p')
	countryCodesP.innerHTML = 'Country Codes: '
	const countryCodesPSpan = createDomElement('span')
	countryCodesPSpan.innerHTML = `${countryObj.alpha2Code}, ${countryObj.alpha3Code}`
	countryCodesP.append(countryCodesPSpan)

	const regionP = createDomElement('p')
	regionP.innerHTML = 'Region:'
	const regionPSpan = createDomElement('span')
	regionPSpan.innerHTML = countryObj.region
	regionP.append(regionPSpan)

	const latLongP = createDomElement('p')
	latLongP.innerHTML = 'Lat Long:'
	const latLongPSpan = createDomElement('span')
	latLongPSpan.innerHTML = formatLatLng(countryObj.latlng)
	latLongP.append(latLongPSpan)

	cardContents.append(capitalP, countryCodesP, regionP, latLongP)
	cardBody.append(cardTitle, image, cardContents)
	card.append(cardBody)
	return card
}

// Formats the latitude and longitude
function formatLatLng(latLngArr) {
	return latLngArr.map(ele => ele.toFixed(2)).join(',')
}

// Creates a Dom element and assigns class and id to it, if they are not empty
function createDomElement(ele, eleClass = '', eleId = '') {
	const element = document.createElement(ele)
	if (eleClass !== '') {
		element.setAttribute('class', eleClass)
	}
	if (eleId !== '') {
		element.setAttribute('id', eleId)
	}
	return element
}

// Generates Body of the document
function generateHtml(countriesInfo) {
	const container = createDomElement('div', 'container-fluid')
	const row = createDomElement('div', 'row')
	const column = createDomElement('div', 'col-12 countriesInfo')

	countriesInfo.forEach(country => {
		const card = createCard(country)
		column.append(card)
	})

	row.append(column)
	container.append(row)
	document.body.append(container)
}
