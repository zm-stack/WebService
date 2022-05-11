function hideServ(){
    var op = document.getElementById('select_service').getElementsByTagName("option");
    for (var i = 0; i < op.length; i++) {
        if(op[i].value == "unknown_debug" || op[i].value == "function_verify") {
            op[i].style.visibility = 'hidden';
        }
    }
}
    
function showServ(){
    var op = document.getElementById('select_service').getElementsByTagName("option");
    for (var i = 0; i < op.length; i++) {
        if(op[i].value == "unknown_debug" || op[i].value == "function_verify") {
            op[i].style.visibility = 'visible';
        }
    }
}

function SelectLang(select){
    if(select.value == 'Solidity'){
    showServ();
    }else if(select.value == 'Go'){
    hideServ();
    }
}

function select_sample(value){
    var selectedOption=value.options[value.selectedIndex];

    if(selectedOption.value=="AmIOnTheFork"){
        document.getElementById("solidity_name").value="AmIOnTheFork";
		editor.setValue("contract AmIOnTheFork {\n\r    function forked() constant returns(bool);\n\r}\n\r\n\rcontract Ethsplit {\n\r\n\r    function split(address ethAddress, address etcAddress) {\n\r\n\r        if (amIOnTheFork.forked()) {\n\r            // if on the forked chain send ETH to ethAddress\n\r            ethAddress.call.value(msg.value)();\n\r        } \n\r        else {\n\r            // if not on the forked chain send ETC to etcAddress less fee\n\r            uint fee = msg.value/100;\n\r            fees.send(fee);\n\r            etcAddress.call.value(msg.value-fee)();\n\r        }\n\r    }\n\r\n\r    // Reject deposits to the contract\n\r    function () {\n\r        throw;  \n\r    }\n\r\n\r    // AmIOnTheFork oracle by _tr\n\r    AmIOnTheFork amIOnTheFork = AmIOnTheFork(0x2bd2326c993dfaef84f696526064ff22eba5b362);\n\r    address fees = 0xdE17a240b031a4607a575FE13122d5195B43d6fC;\n\r}");
        
    }else if(selectedOption.value=="URUGUAY_WINS"){
        document.getElementById("solidity_name").value="URUGUAY_WINS";
        editor.setValue("pragma solidity ^0.4.15;\n\r\n\rcontract URUGUAY_WINS {\n\r    address owner;\n\r    address target = 0xca35b7d915458ef540ade6068dfe2f44e8fa733c;\n\r    address buyer = 0xc435b7d915458ef540ade6068dfe2f44e8fa723e;\n\r    modifier onlyowner {\n\r        if (owner == msg.sender)\n\r            _;\n\r    }\n\r    \n\r    // constructor\n\r    function generic_holder() {\n\r        owner = msg.sender;\n\r    }\n\r    function changebuyer(address sender){\n\r        buyer = sender;\n\r    }\n\r\n\r    function changetarget() onlyowner{\n\r        target = buyer;\n\r    } \n\r    \n\r    function change_owner(address new_owner) external onlyowner {\n\r        owner = new_owner;\n\r    }\n\r    \n\r    function execute(uint _value, bytes _data) external onlyowner returns (bool){\n\r        return target.call.value(_value)(_data);\n\r    }\n\r\n\r    function send(address _to, uint _value) external onlyowner returns (bool){\n\r        return _to.send(_value); \n\r    }\n\r    \n\r    function get_owner() constant returns (address) {\n\r        return owner;\n\r    }\n\r    \n\r}");
        
    }else if(selectedOption.value=="Migrations"){
        document.getElementById("solidity_name").value="Migrations";
        editor.setValue("pragma solidity ^0.4.2;\n\r\n\rcontract Migrations {\n\r  address public owner;\n\r  uint public last_completed_migration;\n\r  address public target = 0xca35b7d915458ef540ade6068dfe2f44e8fa733c;\n\r\n\r  modifier restricted() {\n\r    if (msg.sender == owner) _;\n\r  }\n\r\n\r  function Migrations() {\n\r    owner = msg.sender;\n\r  }\n\r\n\r  function changeOwner(address myowner) {\n\r    owner = myowner;\n\r  }\n\r\n\r  function sendEther(address target) restricted {\n\r    target.call.value(1)();\n\r  }\n\r}");
        
    }else if(selectedOption.value=="generic_holder"){
        document.getElementById("solidity_name").value="generic_holder";
		editor.setValue("pragma solidity ^0.4.15;\n\r\n\rcontract generic_holder {\n\r    address owner;\n\r    address target = 0xca35b7d915458ef540ade6068dfe2f44e8fa733c;\n\r    address buyer = 0xc435b7d915458ef540ade6068dfe2f44e8fa723e;\n\r    modifier onlyowner {\n\r        if (owner == msg.sender)\n\r            _;\n\r    }\n\r    \n\r    // constructor\n\r    function generic_holder() {\n\r        owner = msg.sender;\n\r    }\n\r\n\r    function changetarget(address sender) onlyowner{\n\r        target = sender;\n\r    } \n\r    \n\r    function change_owner(address new_owner) {\n\r        owner = new_owner;\n\r    }\n\r    \n\r    function execute(uint _value, bytes _data) external onlyowner returns (bool){\n\r        return target.call.value(_value)(_data);\n\r    }\n\r\n\r    function send(address _to, uint _value) external onlyowner returns (bool){\n\r        return _to.send(_value); \n\r    }\n\r    \n\r    function get_owner() constant returns (address) {\n\r        return owner;\n\r    }\n\r    \n\r}");
        
    }else if(selectedOption.value=="COIN_BOX"){
        document.getElementById("solidity_name").value="COIN_BOX";
        editor.setValue("// 0x85179AC15AA94E3ca32dd1cc04664E9bB0062115\n\r\n\rpragma solidity ^0.4.19;\n\r\n\rcontract COIN_BOX   \n\r{\n\r    struct Holder   \n\r    {\n\r        uint unlockTime;\n\r        uint balance;\n\r    }\n\r    \n\r    mapping (address => Holder) public Acc;\n\r    \n\r    uint public MinSum;\n\r    \n\r    LogFile Log;\n\r    \n\r    bool intitalized;\n\r    \n\r    function SetLogFile(address _log)\n\r    public\n\r    {\n\r        Log = LogFile(_log);\n\r    }\n\r    \n\r    function Initialized()\n\r    public\n\r    {\n\r        intitalized = true;\n\r    }\n\r    \n\r    function Put(uint _lockTime)\n\r    public\n\r    payable\n\r    {\n\r        var acc = Acc[msg.sender];\n\r        acc.balance += msg.value;\n\r        if(now+_lockTime>acc.unlockTime)acc.unlockTime=now+_lockTime;\n\r        Log.AddMessage(msg.sender,msg.value,'Put');\n\r    }\n\r    \n\r}\n\r\n\r\n\rcontract LogFile\n\r{\n\r    struct Message\n\r    {\n\r        address Sender;\n\r        string  Data;\n\r        uint Val;\n\r        uint  Time;\n\r    }\n\r    \n\r    Message[] public History;\n\r    \n\r    Message LastMsg;\n\r    \n\r    function AddMessage(address _adr,uint _val,string _data)\n\r    public\n\r    {\n\r        LastMsg.Sender = _adr;\n\r        LastMsg.Time = now;\n\r        LastMsg.Val = _val;\n\r        LastMsg.Data = _data;\n\r        History.push(LastMsg);\n\r    }\n\r}\n\r");
        
    }else if(selectedOption.value=="Lottery"){
        document.getElementById("solidity_name").value="Lottery";
        editor.setValue("contract Lottery {\n\r    event GetBet(uint betAmount, uint blockNumber, bool won); \n\r\n\r    struct Bet {\n\r        uint betAmount;\n\r        uint blockNumber;\n\r        bool won;\n\r    }\n\r\n\r    address private organizer;\n\r    Bet[] private bets;\n\r\n\r    // Create a new lottery with numOfBets supported bets.\n\r    function Lottery() {\n\r        organizer = msg.sender;\n\r    }\n\r    \n\r    // Fallback function returns ether\n\r    function() {\n\r        throw;\n\r    }\n\r    \n\r    // Make a bet\n\r    function makeBet() {\n\r        // Won if block number is even\n\r        // (note: this is a terrible source of randomness, please don't use this with real money)\n\r        bool won = (block.number % 2) == 0; \n\r        \n\r        \n\r        // Payout if the user won, otherwise take their money\n\r        if(won) { \n\r            if(!msg.sender.send(msg.value)) {\n\r                // Return ether to sender\n\r                throw;\n\r            } \n\r        }\n\r    }\n\r    \n\r    // Get all bets that have been made\n\r    function getBets() {\n\r        if(msg.sender != organizer) { throw; }\n\r        \n\r        for (uint i = 0; i < bets.length; i++) {\n\r            GetBet(bets[i].betAmount, bets[i].blockNumber, bets[i].won);\n\r        }\n\r    }\n\r    \n\r    // Suicide :(\n\r    function destroy() {\n\r        if(msg.sender != organizer) { throw; }\n\r        \n\r        suicide(organizer);\n\r    }\n\r}")
    	
    }else if(selectedOption.value=="LotteryAddress"){
        document.getElementById("solidity_name").value="LotteryAddress";
        editor.setValue("contract LotteryAddress {\n\r    event GetBet(uint betAmount, uint blockNumber, bool won); \n\r\n\r    struct Bet {\n\r        uint betAmount;\n\r        uint blockNumber;\n\r        bool won;\n\r    }\n\r\n\r    address private organizer;\n\r    Bet[] private bets;\n\r\n\r    // Create a new lottery with numOfBets supported bets.\n\r    function Lottery() {\n\r        organizer = msg.sender;\n\r    }\n\r    \n\r    // Fallback function returns ether\n\r    function() {\n\r        throw;\n\r    }\n\r    \n\r    // Make a bet\n\r    function makeBet() {\n\r        // Won if block number is even\n\r        // (note: this is a terrible source of randomness, please don't use this with real money)\n\r        uint won = block.number % 2; \n\r        \n\r        // Record the bet with an event\n\r        bets[won]=Bet(msg.value, block.number, false);\n\r        \n\r    }\n\r    \n\r   \n\r    // Suicide :(\n\r    function destroy() {\n\r        if(msg.sender != organizer) { throw; }\n\r        \n\r        suicide(organizer);\n\r    }\n\r}")
    	
    }else if(selectedOption.value=="LotteryValue"){
        document.getElementById("solidity_name").value="LotteryValue";
        editor.setValue("contract Lottery {\n\r    event GetBet(uint betAmount, uint blockNumber, bool won); \n\r\n\r    struct Bet {\n\r        uint betAmount;\n\r        bool won;\n\r    }\n\r\n\r    address private organizer;\n\r    Bet[] private bets;\n\r\n\r    // Create a new lottery with numOfBets supported bets.\n\r    function Lottery() {\n\r        organizer = msg.sender;\n\r    }\n\r    \n\r    // Fallback function returns ether\n\r    function() {\n\r        throw;\n\r    }\n\r    \n\r    // Make a bet\n\r    function makeBet() {\n\r        // Won if block number is even\n\r        // (note: this is a terrible source of randomness, please don't use this with real money)\n\r        bool won = (block.number % 2) == 0; \n\r        \n\r        \n\r        \n\r        // Payout if the user won, otherwise take their money\n\r        if(won) { \n\r            bets[0]=Bet(msg.value, false);\n\r        }\n\r    }\n\r    \n\r   \n\r    // Suicide :(\n\r    function destroy() {\n\r        if(msg.sender != organizer) { throw; }\n\r        \n\r        suicide(organizer);\n\r    }\n\r}")
        
    }
    unhighlightError(); 

}
