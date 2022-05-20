var go, solidity = false;
var language = 0, service = 0;

// 根据选择的智能合约编程语言隐藏掉不提供的服务
function hideServ() {
    var op = document.getElementById('select_sample').getElementsByTagName("option");
    for (var i = 0; i < op.length; i++) {
        if (op[i].value == "unknown_debug" || op[i].value == "function_verify") {
            op[i].style.visibility = 'hidden';
        }
    }
}

// 根据选择的Go智能合约编程语言显示提供的服务
function showGoSerice() {
    var op = document.getElementById('select_sample').options;
    for (var i = 1; i < 4; i++){
        op[i].style.display = 'none';
    }
    for (var i = 4; i < 7; i++) {
            op[i].style.display = 'inline';
    }
    for (var i = 7; i < 11; i++) {
            op[i].style.display = 'none';
    }
}

function showSoliditySerice() {
    var op = document.getElementById('select_sample').options;
    for (var i = 1; i < 4; i++){
        op[i].style.display = 'none';
    }
    for (var i = 4; i < 7; i++) {
            op[i].style.display = 'none';
    }
    for (var i = 7; i < 11; i++) {
            op[i].style.display = 'inline';
    }
}



function showVerifySerice() {
    var op = document.getElementById('select_sample').options;
    for (var i = 1; i < 4; i++){
        op[i].style.display = 'inline';
    }
    for (var i = 4; i < 7; i++) {
            op[i].style.display = 'none';
    }
    for (var i = 7; i < 11; i++) {
            op[i].style.display = 'none';
    }
}

// function SelectLang(select) {
//     if (select.value == 'Solidity') {
//         solidity = true;
//         go = false;
//         language = 1;
//         showServ();
//     } else if (select.value == 'Go') {
//         go = true;
//         solidity = false;
//         language = 2;
//         hideServ();
//     }
// }

function SelectLang(select) {
    var lang = document.getElementById(select).innerText;
    document.getElementById(select).classList.add("lang_selected");
    if (lang == "Go")
    {
        document.getElementById("solidity_button").classList.remove("lang_selected");
        go = true;
        solidity = false;
        language = 2;
        if (document.getElementsByClassName("service_selected").length > 0) {
            showGoSerice()
        }

    } else {
         document.getElementById("go_button").classList.remove("lang_selected");
         solidity = true;
         go = false;
         language = 1;
         if (document.getElementsByClassName("service_selected").length > 0) {
             if ("function_verify" == document.getElementsByClassName("service_selected").item(0).id){
                    showVerifySerice()
                } else {
                    showSoliditySerice()
                }
         }

    }
    // if (select.value == 'Solidity') {
    //     solidity = true;
    //     go = false;
    //     language = 1;
    //     showServ();
    // } else if (select.value == 'Go') {
    //     go = true;
    //     solidity = false;
    //     language = 2;
    //     hideServ();
    // }
}


function SelectServ(select){
    document.getElementById(select).classList.add("service_selected");
    if (select == "security_analysis")
    {
        document.getElementById("function_verify").classList.remove("service_selected");
        if (document.getElementsByClassName("lang_selected").length > 0) {
             if ("go_button" == document.getElementsByClassName("lang_selected").item(0).id){
                    showGoSerice()
                } else {
                    showSoliditySerice()
                }
         }

    } else{
        document.getElementById("security_analysis").classList.remove("service_selected");
        showVerifySerice()

    }
}

//
// function SelectServ(select) {
//     if (select.value == 'known_debug') {
//         if (go == true) {
//             showGoCase();
//             service = 1;
//         } else if (solidity == true) {
//             showSolidityCase1();
//             service = 2;
//         }
//     } else if (select.value == 'unknown_debug') {
//         if (solidity == true) {
//             showSolidityCase2();
//             service = 3;
//         }
//     } else if (select.value == 'function_verify') {
//         if (solidity == true) {
//             showSolidityCase3();
//             service = 4;
//         }
//     }
// }

function showGoCase() {
    var op = document.getElementById('select_sample').getElementsByTagName("option");
    for (var i = 0; i < op.length; i++) {
        if (op[i].value == "privacy_leak" || op[i].value == "phantom_read" || op[i].value == "read_after_write") {
            op[i].style.visibility = 'visible';
        } else {
            op[i].style.visibility = 'hidden';
        }
    }
}

function showSolidityCase1() {  //已知漏洞
    var op = document.getElementById('select_sample').getElementsByTagName("option");
    for (var i = 0; i < op.length; i++) {
        if (op[i].value == "Reentrancy" || op[i].value == "PredictTheBlockHash" || op[i].value == "GuessTheRandomNumber" || op[i].value == "BadPRNG") {
            op[i].style.visibility = 'visible';
        } else {
            op[i].style.visibility = 'hidden';
        }
    }
}
function showSolidityCase2() {  //未知漏洞
    var op = document.getElementById('select_sample').getElementsByTagName("option");
    for (var i = 0; i < op.length; i++) {
        if (op[i].value == "Migrations" || op[i].value == "generic_holder") {
            op[i].style.visibility = 'visible';
        } else {
            op[i].style.visibility = 'hidden';
        }
    }
}
function showSolidityCase3() {  //形式化验证
    var op = document.getElementById('select_sample').getElementsByTagName("option");
    for (var i = 0; i < op.length; i++) {
        if (op[i].value == "Annotations" || op[i].value == "Inter-Txn" || op[i].value == "Intra-Txn") {
            op[i].style.visibility = 'visible';
        } else {
            op[i].style.visibility = 'hidden';
        }
    }
}

function select_sample(value){
    var selectedOption=value.options[value.selectedIndex];
    if (selectedOption.value != null) {
        if(selectedOption.value=="Annotations"){
            document.getElementById("solidity_name").value="Annotations";
            editor.setValue("// SPDX-License-Identifier: GPL-3.0\n\rpragma solidity >=0.7.0;\n\r/// @notice invariant x == y\ncontract C {\n    int x;\n    int y;\n\r    /// @notice precondition x == y\n    /// @notice postcondition x == y\n    /// @notice modifies x\n    function add_to_x(int n) internal {\n        x = x + n;\n        require(x >= y); // Ensures that there is no overflow\n    }\n\r    /// @notice modifies x if n > 0\n    /// @notice modifies y if n > 0\n    function add(int n) public {\n        require(n >= 0);\n        add_to_x(n);\n        /// @notice invariant y <= x\n        while (y < x) {\n            y = y + 1;\n        }\n    }\n}");
            
        }else if(selectedOption.value=="DaiToken"){
            document.getElementById("solidity_name").value="DaiToken";
            editor.setValue("// SPDX-License-Identifier: GPL-3.0\n\rpragma solidity ^0.7.0;\n\r/// @notice invariant enableTransfer ==> transferFrom\ncontract DaiToken {\n    mapping(address => uint) public balances;\n    address public owner;\n    uint totalSupply;\n    bool public transferEnabled;\n\r    constructor() public {\n        owner = msg.sender;\n        balances[msg.sender] = totalSupply;\n    }\n\r    function enableTransfer() public {\n        transferEnabled = true;\n    }\n\r    /// @notice precondition transferEnabled == true\n    function transferFrom(address _from, address _to, uint _value) public {\n        require(transferEnabled);\n        balances[_from] -= _value;\n        balances[_to] += _value;\n    }\n}");
            
        }else if(selectedOption.value=="Uniswap"){
            document.getElementById("solidity_name").value="Uniswap";
            editor.setValue("// SPDX-License-Identifier: GPL-3.0\n\rpragma solidity ^0.7.0;\n\rcontract Token {\n    mapping (address => int) balances;\n    int totalSupply;\n\r    constructor() {\n        totalSupply = 7000000000 * (10**18);\n        balances[msg.sender] = totalSupply; // Give the creator all initial tokens\n    }\n\r    /// @notice modifies balances[msg.sender]\n    /// @notice modifies balances[receiver]\n    function transfer(address receiver, int amount) public {\n        balances[msg.sender] += amount;\n        balances[receiver] -= amount;\n    }\n}\n\r/// @notice invariant __verifier_sum_int(Token.balances) == Token.totalSupply\ncontract Uniswap {\n    function tokenToEth(address receiver, int amount) public {\n        Token token = new Token();\n        token.transfer(receiver, amount);\n    }\n}");

        }else if(selectedOption.value=="privacy_leak"){
            document.getElementById("solidity_name").value="privacy_leak";
            editor.setValue("package test\r\n\r\n    import (\r\n    \"fmt\"\r\n    \"github.com/hyperledger/fabric-chaincode-go/shim\"\r\n    \"github.com/hyperledger/fabric-protos-go/peer\"\r\n    )\r\n\r\n    type BadChaincode struct {}\r\n\r\n    func (t *BadChaincode) Init(stub shim.ChaincodeStubInterface) peer.Response {\r\n        return shim.Success([]byte(\"success\"))\r\n    }\r\n\r\n    func (t *BadChaincode) Invoke(stub shim.ChaincodeStubInterface) peer.Response {\r\n        fn, args := stub.GetFunctionAndParameters\(\)\r\n        result, err := stub.GetPrivateData\(fn, string\(args[0]\)\)\r\n        if err != nil {\r\n            return shim.Error\(err.Error\(\)\)\r\n        }\r\n        // Return the result as success payload\r\n        output := []byte\(result\)\r\n        return shim.Success\(output\)\r\n    }\r\n\r\n    func main() {\r\n        if err := shim.Start(new(BadChaincode)); err != nil {\r\n            fmt.Printf(\"Error starting BadChaincode chaincode: %s\", err)\r\n        }\r\n    }");
            
        }else if(selectedOption.value=="phantom_read"){
            document.getElementById("solidity_name").value="phantom_read";
            editor.setValue("package test\r\n\r\n    import (\r\n        \"fmt\"\r\n        \"github.com/hyperledger/fabric-chaincode-go/shim\"\r\n        peer \"github.com/hyperledger/fabric-protos-go/peer\"\r\n    )\r\n\r\n    type BadChaincode struct {}\r\n\r\n    func (t *BadChaincode) Init(stub shim.ChaincodeStubInterface) peer.Response {\r\n        return shim.Success([]byte(\"success\"))\r\n    }\r\n\r\n    func (t *BadChaincode) Invoke(stub shim.ChaincodeStubInterface) peer.Response {\r\n        iterator, _ := stub.GetHistoryForKey(\"key\")\r\n        data, _ := iterator.Next()\r\n        err := stub.PutState(\"key\", data.Value)\r\n        if err != nil {\r\n            return shim.Error(\"could not write new data\")\r\n        }\r\n        return shim.Success([]byte(\"stored\"))\r\n    }\r\n\r\n    func main() {\r\n        if err := shim.Start(new(BadChaincode)); err != nil {\r\n            fmt.Printf(\"Error starting BadChaincode chaincode: %s\", err)\r\n        }\r\n    }\r\n");            

        }else if(selectedOption.value=="read_after_write"){
            document.getElementById("solidity_name").value="read_after_write";
            editor.setValue("package test\r\n\r\n    import (\r\n        \"fmt\"\r\n        \"github.com/hyperledger/fabric-chaincode-go/shim\"\r\n        peer \"github.com/hyperledger/fabric-protos-go/peer\"\r\n    )\r\n\r\n    type BadChaincode struct {}\r\n\r\n    func (t *BadChaincode) Init(stub shim.ChaincodeStubInterface) peer.Response {\r\n        return shim.Success([]byte(\"success\"))\r\n    }\r\n\r\n    func (t *BadChaincode) Invoke(stub shim.ChaincodeStubInterface) peer.Response {\r\n        key := \"key\"\r\n        data := \"data\"\r\n        err := stub.PutState(key, []byte(data))\r\n        if err != nil {\r\n            return shim.Error(\"could not write new data\")\r\n        }\r\n        respone, err := stub.GetState(key)\r\n        if err != nil {\r\n            return shim.Error(\"could not read data\")\r\n        }\r\n        return shim.Success([]byte(respone))\r\n    }\r\n\r\n    func main() {\r\n        if err := shim.Start(new(BadChaincode)); err != nil {\r\n            fmt.Printf(\"Error starting BadChaincode chaincode: %s\", err)\r\n        }\r\n    }")
            
        }else if(selectedOption.value=="Reentrancy"){
            document.getElementById("solidity_name").value="Reentrancy";
            editor.setValue("pragma solidity ^0.4.24;\n\rcontract Reentrancy {\n\r    mapping (address => uint) userBalance;\n\r    function getBalance(address u) view public returns(uint){\n        return userBalance[u];\n    }\n\r    function addToBalance() payable public{\n        userBalance[msg.sender] += msg.value;\n    }\n\r    // Should not detect reentrancy in constructor\r\n    constructor() public {\n        // send userBalance[msg.sender] ethers to msg.sender\n        // if mgs.sender is a contract, it will call its fallback function\n        if (!(msg.sender.call.value(userBalance[msg.sender])())) {\n            revert();\n        }\n        userBalance[msg.sender] = 0;\n    }\n\r    function withdrawBalance() public{\n        // send userBalance[msg.sender] ethers to msg.sender\n        // if mgs.sender is a contract, it will call its fallback function\n        if( ! (msg.sender.call.value(userBalance[msg.sender])() ) ){\n            revert();\n        }\n        userBalance[msg.sender] = 0;\n    }\n\r    function withdrawBalance_fixed() public{\n        // To protect against re-entrancy, the state variable\n        // has to be change before the call\n        uint amount = userBalance[msg.sender];\n        userBalance[msg.sender] = 0;\n        if( ! (msg.sender.call.value(amount)() ) ){\n            revert();\n        }\n    }\n\r    function withdrawBalance_fixed_2() public{\n        // send() and transfer() are safe against reentrancy\n        // they do not transfer the remaining gas\n        // and they give just enough gas to execute few instructions\n        // in the fallback function (no further call possible)\n        msg.sender.transfer(userBalance[msg.sender]);\n        userBalance[msg.sender] = 0;\n    }\n\r    function withdrawBalance_fixed_3() public{\n        // The state can be changed\n        // But it is fine, as it can only occur if the transaction fails\n        uint amount = userBalance[msg.sender];\n        userBalance[msg.sender] = 0;\n        if( ! (msg.sender.call.value(amount)() ) ){\n            userBalance[msg.sender] = amount;\n        }\n    }\n    function withdrawBalance_fixed_4() public{\n        // The state can be changed\n        // But it is fine, as it can only occur if the transaction fails\n        uint amount = userBalance[msg.sender];\n        userBalance[msg.sender] = 0;\n        if( (msg.sender.call.value(amount)() ) ){\n            return;\n        }\n        else{\n            userBalance[msg.sender] = amount;\n        }\n    }\n\r    function withdrawBalance_nested() public{\n        uint amount = userBalance[msg.sender];\n        if( ! (msg.sender.call.value(amount/2)() ) ){\n            msg.sender.call.value(amount/2)();\n            userBalance[msg.sender] = 0;\n        }\n    }\n}\n\rcontract Called{\n    function f() public;\n}\n\rcontract ReentrancyEvent {\n    event E();\n    function test(Called c) public{\n        c.f();\n        emit E();\n    }\n}")
        
        }else if(selectedOption.value=="PredictTheBlockHash"){
            document.getElementById("solidity_name").value="PredictTheBlockHash";
            editor.setValue("pragma solidity ^0.4.24;\n\r//Based on the the Capture the Ether challange at https://capturetheether.com/challenges/lotteries/predict-the-block-hash/\r\n//Note that while it seems to have a 1/2^256 chance you guess the right hash, actually blockhash returns zero for blocks numbers that are more than 256 blocks ago so you can guess zero and wait.\r\ncontract PredictTheBlockHashChallenge {\r\n    struct guess{\r\n        uint block;\r\n        bytes32 guess;\r\n    }\n\r    mapping(address => guess) guesses;\n\r    constructor() public payable {\r\n        require(msg.value == 1 ether);\r\n    }\n\r    function lockInGuess(bytes32 hash) public payable {\r\n        require(guesses[msg.sender].block == 0);\r\n        require(msg.value == 1 ether);\r\n        guesses[msg.sender].guess = hash;\r\n        guesses[msg.sender].block  = block.number + 1;\r\n    }\n\r    function settle() public {\r\n        require(block.number > guesses[msg.sender].block);\r\n        bytes32 answer = blockhash(guesses[msg.sender].block);\r\n        guesses[msg.sender].block = 0;\r\n        if (guesses[msg.sender].guess == answer) {\r\n            msg.sender.transfer(2 ether);\r\n        }\n    }\r\n}")
        
        } else if(selectedOption.value=="GuessTheRandomNumber"){
            document.getElementById("solidity_name").value="GuessTheRandomNumber";
            editor.setValue("pragma solidity ^0.4.21;\n\rcontract GuessTheRandomNumberChallenge {\r\n    uint8 answer;\n\r    function GuessTheRandomNumberChallenge() public payable {\r\n        require(msg.value == 1 ether);\r\n        answer = uint8(keccak256(block.blockhash(block.number - 1), now));\r\n    }\n\r    function isComplete() public view returns (bool) {\r\n        return address(this).balance == 0;\n        }\n\r    function guess(uint8 n) public payable {\r\n        require(msg.value == 1 ether);\r\n        if (n == answer) {\r\n            msg.sender.transfer(2 ether);\r\n        }\r\n    }\r\n}")
        
        } else if(selectedOption.value=="BadPRNG"){
            document.getElementById("solidity_name").value="BadPRNG";
            editor.setValue("pragma solidity ^0.4.21;\n\rcontract BadPRNG{\r\n    event Time(uint);\n\r    function bad0() external{\r\n        uint i = block.timestamp % 10;\r\n    }\n\r    function bad1() external{\r\n        uint i = now % 10;\r\n    }\n\r    function bad2() external{\r\n        uint i = uint256(blockhash(10000)) % 10;    }\n\r    function foo() public returns (uint) {\r\n        return(uint256(blockhash(10000)));\r\n    }\n\r    function bad3() external{\r\n        uint i = foo() % 10;\r\n    }\n\r    function good() external{\r\n        emit Time(block.timestamp);\r\n    }\r\n}")   
        }
    }
    unhighlightError(); 
    document.getElementById("contain").style.display = 'none';
    
}


