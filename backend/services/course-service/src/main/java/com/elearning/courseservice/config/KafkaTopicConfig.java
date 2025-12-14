// package com.elearning.courseservice.config;

// import org.apache.kafka.clients.admin.NewTopic;
// import org.springframework.context.annotation.Bean;
// import org.springframework.kafka.config.TopicBuilder;

// import com.elearning.courseservice.constants.KafkaTopicNames;

// public class KafkaTopicConfig {
//     @Bean
//     public NewTopic courseEventsTopic() {
//         // Tạo một topic tên là "course-events" với 3 partitions và 1 replica.
//         // Trong môi trường production, replication-factor nên là 3.
//         // Trong dev (chỉ có 1 broker), nó phải là 1.
//         return TopicBuilder.name(KafkaTopicNames.COURSE_EVENTS)
//                 .partitions(3)
//                 .replicas(1)
//                 .build();
//     }
// }
