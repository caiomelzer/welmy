import 'package:flutter/material.dart';
import 'package:welmy/pages/home_page.dart';
import 'package:welmy/services/login_api.dart';
import 'package:shared_preferences/shared_preferences.dart';


class LoginPage extends StatelessWidget {
  
  final _ctrlLogin = TextEditingController();
  final _ctrlSenha = TextEditingController();
  final _formKey = GlobalKey<FormState>();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: _body(context),
      backgroundColor: Colors.grey[350],
    );
  }

  _body(BuildContext context) {
    return Form(
      key: _formKey,
      child: Container(
        padding: EdgeInsets.all(15),
        child: ListView(
          children: <Widget>[
            new Center(
                  child: Container(
                    padding: const EdgeInsets.fromLTRB(0, 0, 0, 100),
                    child: new Stack(
                      children: <Widget>[
                        new Image.asset(
                          'assets/images/logo.png',
                          width: 100.0,
                          height: 100.0,
                        ),
                      ],
                    ),
                  ),
                ),
            _textFormField(
              "Email",
              "Digite seu email",
              controller: _ctrlLogin,
              validator : _validaLogin
            ),
            _textFormField(
              "Senha",
              "Digite a Senha",
              senha: true,
              controller: _ctrlSenha,
              validator : _validaSenha
            ),
            _raisedButton("Entrar", Colors.lightBlueAccent, context),
        ],
        ),
      ),
    );
  }

  //var assetsImage = new AssetImage('assets/images/mountain.jpg'); //<- Creates an object that fetches an image.
  //var image = new Image(image: assetsImage, fit: BoxFit.cover); //<- Creates a widget that displays an image.

  _textFormField(
    String label,
    String hint, {
    bool senha = false,
    TextEditingController controller,
    FormFieldValidator<String> validator,
  }) {
    return TextFormField(
      controller: controller,
      validator: validator,
      obscureText: senha,
      decoration: InputDecoration(
        labelText: label,
        hintText: hint,
      ),
    );
  }

  String _validaLogin(String texto) {
    if(texto.isEmpty){
      return "Digite seu email";
    }
    if(texto.length<3){
      return "O campo precisa ter mais de 3 caracteres";
    }
    return null;
  }

  String _validaSenha(String texto) {
    if(texto.isEmpty){
      return "Digite a Senha";
    }
    return null;
  }

  _raisedButton(
    String texto, 
    Color cor, 
    BuildContext context) {
    return RaisedButton(
      color: cor,
      child: Text(
        texto,
        style: TextStyle(
          color: Colors.white,
          fontSize: 20,
        ),
      ),
      onPressed: () {
        _clickButton(context);
      },
    );
  }

   _clickButton(BuildContext context) async {
    bool formOk = _formKey.currentState.validate();

    if (!formOk) {
      return;
    }

    String login = _ctrlLogin.text;
    String senha = _ctrlSenha.text;

    print("Email : $login senha: $senha");

    var response = await LoginApi.login(login,senha);
    
    if(response){
      _navegaHomepage(context);
    }

  }

  _navegaHomepage(BuildContext context){
    Navigator.push( 
      context, MaterialPageRoute(
        builder : (context)=> HomePage()),
    );
  }

}