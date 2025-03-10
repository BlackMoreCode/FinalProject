package com.kh.back.repository;

import com.kh.back.entity.Reaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReactionRepository  extends JpaRepository<Reaction, Long> {
}
