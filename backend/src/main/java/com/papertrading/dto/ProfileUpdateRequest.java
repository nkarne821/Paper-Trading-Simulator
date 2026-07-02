package com.papertrading.dto;

import jakarta.validation.constraints.Email;

public class ProfileUpdateRequest {
    private String fullName;
    private String phone;
    private String avatarUrl;

    @Email(message = "Email should be valid")
    private String email;

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
}