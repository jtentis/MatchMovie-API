package com.example.matchmovie;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.Toast;

public class MatchScreen extends AppCompatActivity {

    ImageView backButton;
    Button match, invite;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.match_screen);

        backButton=findViewById(R.id.back_button);
        match=findViewById(R.id.btn_match);
        invite=findViewById(R.id.btn_invite);

        backButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                getOnBackPressedDispatcher().onBackPressed();
            }
        });

        match.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(MatchScreen.this, ToBeBuilt.class);
                startActivity(intent);
            }
        });

        invite.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Toast.makeText(MatchScreen.this, "Impossível criar convites no momento!", Toast.LENGTH_SHORT).show();
            }
        });
    }
}