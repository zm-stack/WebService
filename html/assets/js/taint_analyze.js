function analyze_solidity(){
    document.getElementById("start_button_1").innerHTML="<strong>Analyzing</strong>";
    var type="solidity";
    var name=document.getElementById("solidity_name").value;
    var target=document.getElementById("target_depth").value;
    var owner=document.getElementById("target_depth").value;
    var code=editor.getValue();
    httpPost(type, name, code, target,owner);
}


    function hasClass(elements, cName) {
        return !!elements.className.match(new RegExp("(\\s|^)" + cName + "(\\s|$)")); // ( \\s|^ ) 判断前面是否有空格 （\\s | $ ）判断后面是否有空格 两个感叹号为转换为布尔值 以方便做判断
    }
    function removeClass(elements, cName) {
        if (hasClass(elements, cName)) {
            elements.className = elements.className.replace(new RegExp("(\\s|^)" + cName + "(\\s|$)"), " "); // replace方法是替换
        }
    }

function analyze_bytecode(){
    document.getElementById("start_button_2").innerHTML="<strong>Analyzing</strong>";
    var type="bytecode";
    var name="";
    var target=document.getElementById("target_depth").value;
    var owner=document.getElementById("owner_depth").value;
    var code=document.getElementById("bytecode").value;
    httpPost(type, name, code, target,owner);
}

function httpPost(type, name, code,target,owner) {
    var xmlhttp;
    xmlhttp=null;
    if (window.XMLHttpRequest)
    {
        // code for all new browsers
        xmlhttp=new XMLHttpRequest();
    }
    else if (window.ActiveXObject)
    {
        // code for IE5 and IE6
        xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
    if (xmlhttp!=null)
    {
        xmlhttp.onreadystatechange=state_Change;
        xmlhttp.open("post","http://39.103.152.161:8080/api/analyze",true);
        //xmlhttp.setRequestHeader("Content-type", "application/json"); 
        //var content = "type="+type+"&code="+code+"&input="+input;
        var formData = new FormData();
        formData.append("type", type);
        formData.append("name", name);
        formData.append("code", code);
        formData.append("target",target);
        formData.append("owner",owner);
        xmlhttp.send(formData);
    }
    else
    {
        alert("Your browser does not support XMLHTTP.");
    }


    function state_Change(){
        document.getElementById("start_button_1").innerHTML="<strong>Analyze Now</strong>";
        document.getElementById("start_button_2").innerHTML="<strong>Click HERE to Start Analyzing!</strong>";
        if (xmlhttp.readyState==4)
        {
            // 4 = "loaded"
            if (xmlhttp.status==200)
            {
                // 200 = OK
                // alert(xmlhttp.responseText);
                var result=xmlhttp.responseText;
                result = JSON.parse(result);
                var o = eval("(" + result + ")");
                verif_result = o.result;

                var erroneousLine; 
                unhighlightError(); 

				
                if (verif_result.indexOf("Error")!=-1)
                {
                    document.getElementById("reentrancy").innerHTML= "Verification Fails";
                    var result_show="<p class='penal-item description'>"+verif_result.replace(/[\n\r]/g,'<br>')+"</p>";
                    document.getElementById("collapse1").innerHTML=result_show;
                    //var num2 = reentrancy_info.replace(/[^\d]/g, '');
                    //var num2 = (/\d+/g).exec(reentrancy_info)
                    var num2 = verif_result.linenumber
                    highlightError(num2);
                }
                else 
                {
                    document.getElementById("reentrancy").innerHTML= "Pass Verification";
                    document.getElementById("collapse1").innerHTML="";
                }

                var stamp = document.getElementById("contain");
                removeClass(stamp, "hidden");

                
            }
            else
            {
                alert("Problem retrieving XML data");
            }
        }

    }
}


