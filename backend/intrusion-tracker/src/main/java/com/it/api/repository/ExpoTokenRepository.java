package com.it.api.repository;

import com.it.api.model.ExpoToken;
import com.it.api.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExpoTokenRepository extends JpaRepository<ExpoToken, Long> {

    List<ExpoToken> findAllByUser(User p);

    List<ExpoToken> findByUserAndToken(User p, String token);


}