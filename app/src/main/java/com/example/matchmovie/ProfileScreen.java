package com.example.matchmovie;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;

import org.w3c.dom.Text;

import java.util.Locale;

public class ProfileScreen extends AppCompatActivity {

    EditText emailUsuario, userUsuario;
    String usuarioNome;
    FirebaseAuth auth;
    Button logout;
    TextView displayNome;
    FirebaseUser usuario;

    ImageView backButton;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.profile_screen);

        emailUsuario = findViewById(R.id.email);
        userUsuario = findViewById(R.id.user);
        auth = FirebaseAuth.getInstance();
        logout = findViewById(R.id.btn_logout);
        displayNome = findViewById(R.id.texto_pic);
        usuario = auth.getCurrentUser();
        usuarioNome = String.valueOf(usuario.getEmail());
        backButton=findViewById(R.id.back_button);

        if(usuario == null){
            Intent intent = new Intent(ProfileScreen.this, LoginScreen.class);
            startActivity(intent);
            finish();
        }else{
            if (usuarioNome.endsWith("@gmail.com")) {
                usuarioNome = usuarioNome.replace("@gmail.com", "");
                usuarioNome=usuarioNome.toUpperCase(Locale. getDefault());
            }
            if (usuarioNome.endsWith("@hotmail.com")) {
                usuarioNome = usuarioNome.replace("@hotmail.com", "");
            }
            displayNome.setText(usuarioNome);
            usuarioNome=usuarioNome.toLowerCase(Locale. getDefault());
            userUsuario.setHint(usuarioNome);
            emailUsuario.setHint(usuario.getEmail());
        }

        logout.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                FirebaseAuth.getInstance().signOut();
                Intent intent = new Intent(ProfileScreen.this, LoginScreen.class);
                startActivity(intent);
                finish();
                Toast.makeText(ProfileScreen.this, "Usuário deslogado com sucesso!", Toast.LENGTH_SHORT).show();
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