package com.example.matchmovie;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.text.TextUtils;
import android.text.method.PasswordTransformationMethod;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.ProgressBar;
import android.widget.Toast;

import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.auth.AuthResult;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;

public class RegisterScreen extends AppCompatActivity {

    EditText nomeUsuario, emailUsuario, passwordUsuario, passConfUsuario;

    ImageView backButton;
    Button btn_registerUsuario;
    ProgressBar progressBarUsuario;
    FirebaseAuth mAuth;

//    @Override
//    public void onStart() {
//        super.onStart();
//        // Check if user is signed in (non-null) and update UI accordingly.
//        FirebaseUser currentUser = mAuth.getCurrentUser();
//        if(currentUser != null){
//            Intent intent = new Intent(RegisterScreen.this, MovieListActivity.class);
//            intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
//            startActivity(intent);
//            finish();
//        }
//    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.register_screen);

        mAuth = FirebaseAuth.getInstance();
        nomeUsuario = findViewById(R.id.nome_usuario);
        emailUsuario = findViewById(R.id.email);
        passwordUsuario = findViewById(R.id.password);
        btn_registerUsuario = findViewById(R.id.btn_register);
        progressBarUsuario = findViewById(R.id.progressBar);
        passConfUsuario = findViewById(R.id.password_confirm);
        backButton=findViewById(R.id.back_button);

        btn_registerUsuario.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String email, password, passwordConf;
                email = String.valueOf(emailUsuario.getText());
                password = String.valueOf(passwordUsuario.getText());
                passwordConf = String.valueOf(passConfUsuario.getText());

                if(TextUtils.isEmpty(email)){
                    Toast.makeText(RegisterScreen.this, "Digite seu email!", Toast.LENGTH_SHORT).show();
                    return;
                }
                if(TextUtils.isEmpty(password)){
                    Toast.makeText(RegisterScreen.this, "Digite sua senha!", Toast.LENGTH_SHORT).show();
                    return;
                }
                if(TextUtils.isEmpty(passwordConf)) {
                    Toast.makeText(RegisterScreen.this, "Confirme sua senha!", Toast.LENGTH_SHORT).show();
                    return;
                }else{
                    progressBarUsuario.setVisibility(View.VISIBLE);
                }

                mAuth.createUserWithEmailAndPassword(email, password)
                        .addOnCompleteListener(new OnCompleteListener<AuthResult>() {
                            @Override
                            public void onComplete(@NonNull Task<AuthResult> task) {
                                progressBarUsuario.setVisibility(View.GONE);
                                if(TextUtils.equals(password,passwordConf)) {
                                    if (task.isSuccessful()) {
                                        Toast.makeText(RegisterScreen.this, "Conta criada com sucesso!",
                                                Toast.LENGTH_SHORT).show();
                                        Intent intent = new Intent(RegisterScreen.this, LoginScreen.class);
                                        intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
                                        startActivity(intent);
                                    } else {
                                        progressBarUsuario.setVisibility(View.GONE);
                                        Toast.makeText(RegisterScreen.this, "Erro ao registrar, tente novamente!",
                                                Toast.LENGTH_SHORT).show();
                                    }
                                }else{
                                    Toast.makeText(RegisterScreen.this, "Senhas não coincidem!", Toast.LENGTH_SHORT).show();
                                }
                            }
                        });
            }
        });

        backButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                getOnBackPressedDispatcher().onBackPressed();
            }
        });
    }
}