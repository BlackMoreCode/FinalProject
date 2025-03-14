package com.kh.back.repository;

import com.kh.back.constant.Action;
import com.kh.back.entity.Reaction;
import com.kh.back.entity.member.Member;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
@Repository
public interface ReactionRepository  extends JpaRepository<Reaction, Long> {
    Optional<Reaction> findByMemberAndPostIdAndAction(Member member, String postId, Action action);
    List<Reaction> findByMember(Member member);
}
