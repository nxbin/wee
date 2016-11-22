$(document).ready(function(){
		//miaomin 写选择器必须要严谨啊
		$('#product_filter_form select').change(function() {
		    $('#product_filter_form').submit(); 
		});
		
		$('#product_filter_form :checkbox').click(function() {
		    $('#product_filter_form').submit(); 
		});
});