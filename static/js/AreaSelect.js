/* Zerock 2013-09-10 */
(function ($) {
	$(document).ready(function () {
		Init();
		if(province) { $('select[name=province]').val(province).change(); }
		if(city) { $('select[name=city]').val(city).change(); }
		if(region) { $('select[name=region]').val(region).change(); }

		function Init() {
			var Province = getDataByKeyValue(AreaInfo, 'pid', 100000);
			///setSelectData('select[name=province]', Province, 'id', 'name', '省/直辖市');
			setSelectData('select[name=province]', Province, 'id', 'name', '---');
			$('select[name=province]').change(function () {
				var City = getDataByKeyValue(AreaInfo, 'pid', $(this).val());
//				resetSelect($('select[name=region]'), '区/县');
//				setSelectData('select[name=city]', City, 'id', 'name', '城市');
				resetSelect($('select[name=region]'), '---');
				setSelectData('select[name=city]', City, 'id', 'name', '---');
			});
			$('select[name=city]').change(function () {
				var Region = getDataByKeyValue(AreaInfo, 'pid', $(this).val());
//				resetSelect($('select[name=region]'), '区/县');
//				setSelectData('select[name=region]', Region, 'id', 'name', '区/县');
				resetSelect($('select[name=region]'), '---');
				setSelectData('select[name=region]', Region, 'id', 'name', '---');
			});

//			resetSelect($('select[name=city]'), '城市');
//			resetSelect($('select[name=region]'), '区/县');
			resetSelect($('select[name=city]'), '---');
			resetSelect($('select[name=region]'), '---');
		}
	});
})(jQuery);