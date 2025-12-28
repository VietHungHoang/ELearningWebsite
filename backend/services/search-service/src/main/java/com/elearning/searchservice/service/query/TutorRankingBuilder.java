package com.elearning.searchservice.service.query;

import co.elastic.clients.elasticsearch._types.query_dsl.FunctionScore;
import co.elastic.clients.elasticsearch._types.query_dsl.FunctionScoreMode;
import co.elastic.clients.elasticsearch._types.query_dsl.Query;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

/**
 * Builds function score queries for ranking tutors
 */
@Slf4j
@Component
public class TutorRankingBuilder {

    /**
     * Wrap query with function score for custom ranking
     */
    public Query buildFunctionScoreQuery(Query baseQuery) {
        return Query.of(q -> q
                .functionScore(fs -> fs
                        .query(baseQuery)
                        .functions(buildScoringFunctions())
                        .scoreMode(FunctionScoreMode.Multiply)
                        .boostMode(co.elastic.clients.elasticsearch._types.query_dsl.FunctionBoostMode.Multiply)
                )
        );
    }
    
    /**
     * Build all scoring functions for ranking
     */
    private List<FunctionScore> buildScoringFunctions() {
        List<FunctionScore> functions = new ArrayList<>();
        
        // Boost verified tutors (x1.5)
        functions.add(FunctionScore.of(f -> f
                .filter(Query.of(q -> q
                        .term(t -> t
                                .field("isVerified")
                                .value(true)
                        )
                ))
                .weight(1.5)
        ));
        
        // Boost high-rated tutors (rating >= 4.5) (x1.3)
        functions.add(FunctionScore.of(f -> f
                .filter(Query.of(q -> q
                        .range(r -> r
                                .number(n -> n
                                        .field("averageRating")
                                        .gte(4.5)
                                )
                        )
                ))
                .weight(1.3)
        ));
        
        // Boost tutors with many reviews (>= 50) (x1.15)
        functions.add(FunctionScore.of(f -> f
                .filter(Query.of(q -> q
                        .range(r -> r
                                .number(n -> n
                                        .field("totalReviews")
                                        .gte(50.0)
                                )
                        )
                ))
                .weight(1.15)
        ));
        
        // Boost based on popularity score (field value factor)
        functions.add(FunctionScore.of(f -> f
                .fieldValueFactor(fvf -> fvf
                        .field("popularityScore")
                        .factor(1.2)
                        .modifier(co.elastic.clients.elasticsearch._types.query_dsl.FieldValueFactorModifier.Sqrt)
                        .missing(1.0)
                )
        ));
        
        return functions;
    }
}
