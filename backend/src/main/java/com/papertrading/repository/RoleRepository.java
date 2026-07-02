package com.papertrading.repository;

import com.papertrading.model.Role;
import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RoleRepository extends CrudRepository<Role, Long> {

    Optional<Role> findByName(String name);

    @Query("INSERT INTO user_roles (user_id, role_id) VALUES (:userId, :roleId)")
    void assignRoleToUser(@Param("userId") Long userId, @Param("roleId") Long roleId);

    @Query("SELECT r.id, r.name, r.description, r.created_at FROM roles r INNER JOIN user_roles ur ON r.id = ur.role_id WHERE ur.user_id = :userId")
    List<Role> findRolesByUserId(@Param("userId") Long userId);
}