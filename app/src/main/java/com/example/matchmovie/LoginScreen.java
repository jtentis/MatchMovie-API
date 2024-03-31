package com.example.matchmovie;

import androidx.activity.OnBackPressedCallback;
import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.text.TextUtils;
import android.util.Log;
import android.view.MotionEvent;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;

import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.auth.AuthResult;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;

public class LoginScreen extends AppCompatActivity implements View.OnTouchListener {


    EditText emailUsuario, passwordUsuario;
    Button btn_loginUsuario;
    ProgressBar progressBarUsuario;
    FirebaseAuth mAuth;

    @Override
    public void onStart() {
        super.onStart();
        // Check if user is signed in (non-null) and update UI accordingly.
        FirebaseUser currentUser = mAuth.getCurrentUser();
        if(currentUser != null){
            Intent intent = new Intent(LoginScreen.this, MovieListActivity.class);
            intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
            startActivity(intent);
            Toast.makeText(LoginScreen.this, "Login automático feito com sucesso!", Toast.LENGTH_SHORT).show();
            finish();
        }
    }
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.login_screen);

        mAuth = FirebaseAuth.getInstance();
        emailUsuario = findViewById(R.id.email);
        passwordUsuario = findViewById(R.id.password);
        btn_loginUsuario = findViewById(R.id.btn_login);
        progressBarUsuario = findViewById(R.id.progressBar2);

        Button btn_visitante = (Button) findViewById(R.id.btn_visitante);
        TextView register_text = (TextView) findViewById(R.id.register_text);

        register_text.setOnTouchListener(this);

        btn_visitante.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
//                Log.v("arroz", "clicou né");
                Intent intent = new Intent(LoginScreen.this, MovieListActivity.class);
                intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
                startActivity(intent);
            }
        });
        btn_loginUsuario.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String email, password;
                email = String.valueOf(emailUsuario.getText());
                password = String.valueOf(passwordUsuario.getText());

                if(TextUtils.isEmpty(email)){
                    Toast.makeText(LoginScreen.this, "Digite seu email!", Toast.LENGTH_SHORT).show();
                    return;
                }
                if(TextUtils.isEmpty(password)){
                    Toast.makeText(LoginScreen.this, "Digite sua senha!", Toast.LENGTH_SHORT).show();
                    return;
                }else{
                    progressBarUsuario.setVisibility(View.VISIBLE);
                }

                mAuth.signInWithEmailAndPassword(email, password)
                        .addOnCompleteListener(new OnCompleteListener<AuthResult>() {
                            @Override
                            public void onComplete(@NonNull Task<AuthResult> task) {
                                if (task.isSuccessful()) {
                                    progressBarUsuario.setVisibility(View.GONE);
                                    Toast.makeText(LoginScreen.this, "Usuário logado com sucesso!",Toast.LENGTH_SHORT).show();
                                    Intent intent = new Intent(LoginScreen.this, MovieListActivity.class);
                                    intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
                                    startActivity(intent);
                                    finish();
                                } else {
                                    progressBarUsuario.setVisibility(View.GONE);
                                    Toast.makeText(LoginScreen.this, "Usuário ou senha incorretos!", Toast.LENGTH_SHORT).show();
                                }
                            }
                        });
            }
        });
    }
    @Override
    public boolean onTouch(View v, MotionEvent event) {
        Intent intent = new Intent(LoginScreen.this, RegisterScreen.class);
        intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
        startActivity(intent);
        return true;
    }
}