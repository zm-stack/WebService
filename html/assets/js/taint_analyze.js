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
        xmlhttp.open("post","http://39.106.37.208:5000/api/analyze",true);
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
                reentrancy_info = result.reentrancy[0];
                random_info = result.Pseudo_random[0];

                var erroneousLine; 
                unhighlightError(); 

				
                if (reentrancy_info.indexOf("Reentrancy")!=-1)
                {
                    document.getElementById("reentrancy").innerHTML= "Found Reentrancy bug";
                    var result_show="<p class='penal-item description'>"+reentrancy_info.replace(/[\n\r]/g,'<br>')+"</p>";
                    document.getElementById("collapse1").innerHTML=result_show;
                    //var num2 = reentrancy_info.replace(/[^\d]/g, '');
                    var num2 = (/\d+/g).exec(reentrancy_info)
                    highlightError(num2[0]-1);
                }
                else 
                {
                    document.getElementById("reentrancy").innerHTML= "No Reentrancy bug found";
                    document.getElementById("collapse1").innerHTML="";
                }

                var stamp = document.getElementById("contain");
                removeClass(stamp, "hidden");

                if (random_info != "")
                {
                    document.getElementById("random").innerHTML= "Prng Vulnerability found";
                    var result_show="<p class='penal-item description'>"+random_info.replace(/[\n\r]/g,'<br>')+"</p>";
                    document.getElementById("collapse2").innerHTML=result_show;
                    var num1 = (/\d+/g).exec(random_info)
                    highlightError(num1[0]-1);
                }
                else 
                {
                    document.getElementById("random").innerHTML= "No Prng Vulnerability found";
                    document.getElementById("collapse2").innerHTML="";
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


