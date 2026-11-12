package com.bugthrive.labs.auth;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

/** The ADMIN role is granted only via the bootstrap account, never via public registration. */
@SpringBootTest(properties = {
        "app.admin.email=Admin@BugThrive.test",
        "app.admin.password=AdminPass123",
        "spring.datasource.url=jdbc:h2:mem:bugthrive_admin_test;MODE=PostgreSQL;DATABASE_TO_LOWER=TRUE;DB_CLOSE_DELAY=-1"
})
@AutoConfigureMockMvc
@ActiveProfiles("test")
class AdminBootstrapTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void bootstrapAdminCanLogInAndPassesAdminAuthorization() throws Exception {
        String body = mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"admin@bugthrive.test\",\"password\":\"AdminPass123\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.user.role").value("ADMIN"))
                .andReturn().getResponse().getContentAsString();
        String token = objectMapper.readTree(body).at("/data/accessToken").asText();

        // No admin endpoints exist yet: getting 404 (not 403) proves the ADMIN role passed authorization.
        mockMvc.perform(get("/api/v1/admin/anything").header("Authorization", "Bearer " + token))
                .andExpect(status().isNotFound());
    }
}
