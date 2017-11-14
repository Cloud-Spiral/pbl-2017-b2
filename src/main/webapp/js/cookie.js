/**
 * 
 */
var bar = true;
$("#rightbar").mousedown(function (e){
	if(bar){
		document.getElementById("side").style.right="-510px";
	}
	else{
		document.getElementById("side").style.right="0px";
	}
	bar = !bar;
});

function getCookie( name )
{
    var result = null;

    var cookieName = name + '=';
    var allcookies = document.cookie;

    var position = allcookies.indexOf( cookieName );
    if( position != -1 )
    {
        var startIndex = position + cookieName.length;

        var endIndex = allcookies.indexOf( ';', startIndex );
        if( endIndex == -1 )
        {
            endIndex = allcookies.length;
        }

        result = decodeURIComponent(
            allcookies.substring( startIndex, endIndex ) );
    }

    return result;
}