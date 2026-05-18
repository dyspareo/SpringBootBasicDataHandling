package org.example;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public User saveUser(User user) {
        return userRepository.save(user);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
public User updateUser(Long id, User updatedUser) {
    User existing = userRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    
    existing.setName(updatedUser.getName());
    existing.setAge(updatedUser.getAge());
    existing.setEmail(updatedUser.getEmail());
    
    return userRepository.save(existing);
}

    public User getUserById(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    public void deleteUserById(Long id) {
        userRepository.deleteById(id);
    }
}
