function AjaxManager()
{
	this.postJSON = function(server_url, jsonQuery, successCallback)
	{
		
		$.ajax({
		  url: server_url,
		  type: "POST",
		  data: {q : jsonQuery},
		  dataType: "json",
		  success: successCallback
		});
	}
}