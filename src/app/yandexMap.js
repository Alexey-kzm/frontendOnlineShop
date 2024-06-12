let ymaps = null;
let map;
let placemark;

export const mapsInit=(newYmaps, setAddress)=>{
	ymaps = newYmaps;
	if(map)return;
	map = new ymaps.Map("map", {
		center: [55.755864, 37.617698],
		zoom: 9
	});

	map.events.add('click', function (e) {
		let coords = e.get('coords');

		// Если метка уже создана – просто передвигаем ее.
		if (placemark) {
			placemark.geometry.setCoordinates(coords);
		}
		// Если нет – создаем.
		else {
			placemark = createPlacemark(coords);
			map.geoObjects.add(placemark);
			// Слушаем событие окончания перетаскивания на метке.
			placemark.events.add('dragend', function () {
				getAddress(placemark.geometry.getCoordinates());
			});
		}
		getAddress(coords);
	});



	function getAddress(coords) {
		placemark.properties.set('iconCaption', 'поиск...');
		// @ts-ignore
		ymaps.geocode(coords).then(function (res) {
			let firstGeoObject = res.geoObjects.get(0);
			setAddress([firstGeoObject.getCountry(), firstGeoObject.getAddressLine()].join(', '));
			placemark.properties
				.set({
					iconCaption: [
						[firstGeoObject.getThoroughfare(), firstGeoObject.getPremiseNumber(), firstGeoObject.getPremise()].join(' ')
					].filter(Boolean).join(', '),
					balloonContent: [firstGeoObject.getThoroughfare(), firstGeoObject.getPremiseNumber(), firstGeoObject.getPremise()].join(' ')
				});
		});
	}
}
export function geocodeInput(value){
	if(value==="")return;
	ymaps.geocode(value).then(function (res) {
		let obj = res.geoObjects.get(0),
			error, hint;

		if (obj) {
			// Об оценке точности ответа геокодера можно прочитать тут: https://tech.yandex.ru/maps/doc/geocoder/desc/reference/precision-docpage/
			switch (obj.properties.get('metaDataProperty.GeocoderMetaData.precision')) {
				case 'exact':
					break;
				case 'number':
				case 'near':
				case 'range':
					error = 'Неточный адрес, требуется уточнение';
					hint = 'Уточните номер дома';
					break;
				case 'street':
					error = 'Неполный адрес, требуется уточнение';
					hint = 'Уточните номер дома';
					break;
				case 'other':
				default:
					error = 'Неточный адрес, требуется уточнение';
					hint = 'Уточните адрес';
			}
		} else {
			error = 'Адрес не найден';
			hint = 'Уточните адрес';
		}

		// Если геокодер возвращает пустой массив или неточный результат, то показываем ошибку.
			showResult(obj);
	}, function (e) {
		console.log(e)
	})
}
export async function validateAddress(value){
	const res = await ymaps.geocode(value)
		let obj = res.geoObjects.get(0);
		let error=false;

		let	address = [obj.getCountry(), obj.getAddressLine()].join(', ')

		if (obj) {
			// Об оценке точности ответа геокодера можно прочитать тут: https://tech.yandex.ru/maps/doc/geocoder/desc/reference/precision-docpage/
			switch (obj.properties.get('metaDataProperty.GeocoderMetaData.precision')) {
				case 'exact':
					break;
				case 'number':
				case 'near':
				case 'range':
					error = true;
					break;
				case 'street':
					error = true;
					break;
				case 'other':
				default:
					error = true;
			}
		} else {
			error =true;
		}

		return {error, address};
}
function showResult(obj) {

	let	bounds = obj.properties.get('boundedBy');

	let	mapState = ymaps.util.bounds.getCenterAndZoom(
			bounds,
			[600,600]
		)

	let	address = [obj.getCountry(), obj.getAddressLine()].join(', ')
	let	shortAddress = [obj.getThoroughfare(), obj.getPremiseNumber(), obj.getPremise()].join(' ');
	mapState.controls = [];
	createMap(mapState, shortAddress);
}

function createMap(state, caption) {
	// Если карта еще не была создана, то создадим ее и добавим метку с адресом.
	if (!map) {
		map = new ymaps.Map('map', state);
		placemark = new ymaps.Placemark(
			map.getCenter(), {
				iconCaption: caption,
				balloonContent: caption
			}, {
				preset: 'islands#redDotIconWithCaption'
			});
		map.geoObjects.add(placemark);
		// Если карта есть, то выставляем новый центр карты и меняем данные и позицию метки в соответствии с найденным адресом.
	} else {
		if(!placemark){
			placemark = createPlacemark(state.center);
			map.geoObjects.add(placemark);
		}
		map.setCenter(state.center, state.zoom);
		placemark.geometry.setCoordinates(state.center);
		placemark.properties.set({iconCaption: caption, balloonContent: caption});
	}
}

function createPlacemark(coords) {
	// @ts-ignore
	return new ymaps.Placemark(coords, {
		iconCaption: 'поиск...'
	}, {
		preset: 'islands#violetDotIconWithCaption',
		draggable: true
	});
}